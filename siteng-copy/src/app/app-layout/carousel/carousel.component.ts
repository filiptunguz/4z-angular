import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  inject,
  Input,
  NgZone,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import {filter, fromEvent, interval} from 'rxjs';
import {WINDOW} from '@ng-web-apis/common';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {IntersectionObserverModule} from "@ng-web-apis/intersection-observer";
import {TwinSlideService} from './twin-slide.service';
import {MatIconModule} from '@angular/material/icon';
import {ForModule} from "@rx-angular/template";

export interface CarouselOptions {
  visibleItems?: number;
  loop?: boolean;
  lazy?: LazyCarousel;
  navigation?: boolean;
  spaceBetween?: number;
  auto?: AutoCarousel;
  swiperTwin?: 'none' | 'main' | 'secondary';
  breakpoints?: {
    [width: number]: CarouselOptions;
  };
  pagination?: boolean;
  keyboard?: boolean;
  zoom?: boolean;
}

export interface LazyCarousel {
  lazy?: boolean;
  items?: number;
}

export interface AutoCarousel {
  auto?: boolean;
  delay?: number;
  reverse?: boolean;
}

@UntilDestroy()
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule, IntersectionObserverModule, NgClass, NgTemplateOutlet, ForModule, NgIf],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements AfterViewInit {
  changeDetectorRef = inject(ChangeDetectorRef);
  windowRef = inject(WINDOW);
  twinSlideService = inject(TwinSlideService);
  zone = inject(NgZone);

  itemWidth: number = 0;
  prevBreakpoint: number = 0;
  nextBreakpoint: number = 0;
  visibleElements: number[] = [];
  lastVisibleElement: number = 0;
  scrollLeft: number = 0;
  focusItem: number = 0;

  options: CarouselOptions = {
    visibleItems: 1,
    loop: false,
    lazy: {
      lazy: false,
      items: 1,
    },
    navigation: false,
    spaceBetween: 1,
    swiperTwin: 'none',
    auto: {
      auto: false,
      delay: 1000,
      reverse: false,
    },
    pagination: false,
    keyboard: false,
    zoom: false,
  };
  breakPointOptions: CarouselOptions = {};

  @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('carouselSection') carouselSection!: ElementRef;
  @ViewChildren('carouselItems') carouselItems!: ElementRef[];
  @ContentChildren('carouselItem') items?: QueryList<TemplateRef<HTMLElement>>;

  @Input() set config(config: CarouselOptions) {
    if (config.auto) {
      Object.assign(this.options.auto as AutoCarousel, config.auto);
      Object.assign(config.auto as AutoCarousel, this.options.auto);
    }
    if (config.lazy) {
      Object.assign(this.options.lazy as LazyCarousel, config.lazy);
      Object.assign(config.lazy as AutoCarousel, this.options.lazy);
    }
    Object.assign(this.options, config);

    this.breakPointOptions = { ...this.options };

    if (this.breakPointOptions.breakpoints) {
      this.setBreakpointProperties();
    }
  }

  resize$ = fromEvent(this.windowRef, 'resize');

  ngAfterViewInit(): void {
    if (!this.breakPointOptions.lazy?.lazy) {
      this.changeDetectorRef.detach();
    }

    this.setSwiperOptions();
    this.itemWidth =
      this.carousel.nativeElement.firstChild.offsetWidth +
      this.breakPointOptions.spaceBetween! * 16;

    // AutoSlide
    if (this.breakPointOptions.auto!.auto) {
      interval(this.breakPointOptions.auto!.delay).subscribe(() =>
        this.slide(this.breakPointOptions.auto!.reverse || false)
      );
    }

    // For twin sliding
    const slideToTwin = (index: number) => {
      const item = this.carouselItems.find((el, i) => i === index);
      this.carousel.nativeElement.scrollLeft = item?.nativeElement.offsetLeft;
      this.scrollLeft = item?.nativeElement.offsetLeft;
      this.focusPaginationItem(null);
    };

    if (this.secondaryTwin) {
      this.twinSlideService.slideToSecondaryElement$.pipe(untilDestroyed(this)).subscribe(index => {
        slideToTwin(index);
      });
    } else if (this.mainTwin) {
      this.twinSlideService.slideToMainElement$.pipe(untilDestroyed(this)).subscribe(index => {
        slideToTwin(index);
      });
    }

    // Keyboard Slide
    if (this.breakPointOptions.keyboard) {
      this.windowRef.onkeydown = event => {
        switch (event.key) {
          case 'ArrowLeft':
            this.slide(true);
            break;
          case 'ArrowRight':
            this.slide(false);
            break;
        }
      };
    }

    // Breakpoints
    if (this.breakPointOptions.breakpoints) {
      // This is detrimental to performance but only if windows resizes
      this.resize$
        .pipe(
          untilDestroyed(this),
          filter(() => this.breakpointTrigger)
        )
        .subscribe(() => this.setBreakpointProperties());
    }
  }

  slide(left: boolean) {
    this.itemWidth =
      this.carousel.nativeElement.firstChild.offsetWidth +
      this.breakPointOptions.spaceBetween! * 16;

    const scrollLeft = this.carousel.nativeElement.scrollLeft;
    const maxScroll =
      this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.offsetWidth;

    if (this.scrollLeft > maxScroll) {
      this.scrollLeft = maxScroll;
    }

    if (scrollLeft < maxScroll - maxScroll * 0.01 && (scrollLeft !== 0 || !left)) {
      this.scrollLeft += left ? -1 * this.itemWidth : this.itemWidth;
    } else if (1 - scrollLeft / maxScroll < 0.01 && scrollLeft !== 0) {
      if (this.breakPointOptions.loop) {
        this.scrollLeft = left ? this.scrollLeft + -1 * this.itemWidth : 0;
      } else if (left) {
        this.scrollLeft = this.scrollLeft + -1 * this.itemWidth;
      }
    } else if (scrollLeft === 0) {
      if (this.breakPointOptions.loop) {
        this.scrollLeft = maxScroll;
      }
    } else {
      this.scrollLeft = 0;
    }

    this.carousel.nativeElement.scrollLeft = this.scrollLeft;

    this.focusPaginationItem(null);
  }

  setBreakpointProperties() {
    let breakpoints = Object.keys(this.breakPointOptions.breakpoints!).map(breakpoint => {
      return Number(breakpoint);
    });

    this.setPrevNextBreakpoints(breakpoints);

    breakpoints = breakpoints.filter(breakpoint => {
      return breakpoint < this.windowRef.innerWidth;
    });

    this.breakPointOptions = { ...this.options };

    breakpoints.map(breakpoint => {
      Object.assign(
        this.breakPointOptions,
        this.breakPointOptions.breakpoints![Number(breakpoint)]
      );
    });

    if (this.breakPointOptions.lazy?.lazy) {
      // Variant with virtual loading
      // this.visibleElements = [
      //   -1 * this.breakPointOptions.lazy!.items!,
      //   this.breakPointOptions.visibleItems! + this.breakPointOptions.lazy!.items!,
      // ];

      // Variant with all visible elements on the end
      this.lastVisibleElement =
        this.breakPointOptions.lazy!.items! + this.breakPointOptions.visibleItems!;
    }

    this.setSwiperOptions();
  }

  setPrevNextBreakpoints(breakpoints: number[]) {
    let nextBreakpoints = breakpoints.filter(x => {
      return Number(x) > this.windowRef.innerWidth;
    });
    let prevBreakpoints = breakpoints.filter(x => {
      return Number(x) < this.windowRef.innerWidth;
    });

    this.nextBreakpoint = Math.min.apply(Math, nextBreakpoints);
    this.prevBreakpoint = Math.max.apply(Math, prevBreakpoints);
  }

  setSwiperOptions() {
    if (this.carouselSection) {
      const swiperElement = this.carouselSection.nativeElement;
      const setSwiperProperty = (property: string, value: string | number) => {
        swiperElement.style.setProperty(property, value);
      };

      setSwiperProperty('--visible-items', this.breakPointOptions.visibleItems!.toString());
      setSwiperProperty('--space', this.breakPointOptions.spaceBetween!.toString());
      setSwiperProperty(
        '--display-navigation',
        this.breakPointOptions.navigation ? 'flex' : 'none'
      );
    }
  }

  slideToItem(index: number) {
    const item = this.carouselItems.find((el, i) => index === i);
    this.carousel.nativeElement.scrollLeft = item?.nativeElement.offsetLeft;
    this.focusPaginationItem(index);
  }

  loadItem(index: number) {
    if (this.breakPointOptions.lazy?.lazy) {
      // Variant like virtual scroll
      // return index >= this.visibleElements[0] && index <= this.visibleElements[1];

      // Variant with all visible elements on the end
      return index < this.lastVisibleElement;
    }

    return true;
  }

  intersectElement(event: IntersectionObserverEntry[], i: number) {
    // TODO: Try to do lazy load from here (to prevent doing loadItem for every element)

    // For zoom out
    if (this.breakPointOptions.zoom) {
      const item = this.carouselItems.find((el, index) => i === index)?.nativeElement.firstChild;
      if (item) item.style.transform = 'scale(1)';
    }

    // Variant like virtual scroll
    // const firstElement = this.visibleElements[0];
    // const lastElement = this.visibleElements[1];
    // const visibleItems = this.breakPointOptions.visibleItems!;
    const offsetElements = this.breakPointOptions.lazy!.items!;

    event
      .filter(entry => entry.isIntersecting)
      .map(() => {
        // Variant like virtual scroll
        // if (this.breakPointOptions.lazy?.lazy) {
        //   if (i - offsetElements < firstElement) {
        //     this.visibleElements[0] = i - offsetElements;
        //     this.visibleElements[1] = i + visibleItems;
        //   }
        //
        //   if (i + offsetElements > lastElement) {
        //     this.visibleElements[1] = i + offsetElements;
        //     this.visibleElements[0] = i - visibleItems;
        //   }
        // }

        // Variant with all visible elements on the end
        if (this.breakPointOptions.lazy?.lazy) {
          if (i + offsetElements >= this.lastVisibleElement) {
            this.lastVisibleElement = i + offsetElements;
          }
        }

        if (this.mainTwin) {
          this.twinSlideService.slideToSecondaryElement(i);
        }
      });
  }

  slideToMainItem(index: number) {
    if (this.secondaryTwin) {
      this.twinSlideService.slideToMainElement(index);
    }
  }

  focusPaginationItem(index: number | null) {
    const focusedItem = this.focusItem;

    if (this.breakPointOptions.pagination) {
      if (index !== null) {
        this.focusItem = index;
      } else {
        const newFocus = Math.round(this.scrollLeft / this.itemWidth);
        const lastItem = this.carouselItems.length - 1;
        this.focusItem = newFocus > lastItem ? lastItem : newFocus;
      }
    }

    if (focusedItem !== this.focusItem && !this.breakPointOptions.lazy?.lazy) {
      this.zone.runOutsideAngular(() => {
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  zoom(event: MouseEvent, index: number) {
    event.preventDefault();
    if (this.breakPointOptions.zoom) {
      const item = this.carouselItems.find((el, i) => i === index)?.nativeElement.firstChild;

      item.style.transition = 'transform 200ms ease-in-out';

      if (!item.style.transform || item.style.transform === 'scale(1)') {
        let xZoom = event.x - item.getBoundingClientRect().left;
        let yZoom = event.y - item.getBoundingClientRect().top;

        const itemWidth = item.offsetWidth;
        const itemHeight = item.offsetHeight;

        xZoom = 100 - (xZoom / itemWidth) * 200;
        yZoom = 100 - (yZoom / itemHeight) * 200;

        item.style.transform = `translate(${xZoom}%, ${yZoom}%) scale(3)`;
      } else {
        item.style.transform = `scale(1)`;
      }
    }
  }

  get breakpointTrigger() {
    return (
      this.windowRef.innerWidth > this.nextBreakpoint ||
      this.windowRef.innerWidth < this.prevBreakpoint
    );
  }

  get secondaryTwin(): boolean {
    return this.breakPointOptions.swiperTwin === 'secondary';
  }

  get mainTwin(): boolean {
    return this.breakPointOptions.swiperTwin === 'main';
  }
}
