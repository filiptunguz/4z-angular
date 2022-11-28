import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import {filter, fromEvent, interval} from 'rxjs';
import {WINDOW} from '@ng-web-apis/common';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {IntersectionObserverModule} from '@ng-web-apis/intersection-observer';
import {TwinSlideService} from './twin-slide.service';
import {MatIconModule} from '@angular/material/icon';
import {ForModule} from "@rx-angular/template";

export interface CarouselOptions {
  visibleItems?: number;
  loop?: boolean;
  lazy?: LazyCarousel;
  navigation?: NavigationCarousel;
  spaceBetween?: number;
  auto?: AutoCarousel;
  carouselTwin?: 'none' | 'main' | 'secondary';
  breakpoints?: {
    [width: number]: CarouselOptions;
  };
  pagination?: PaginationCarousel;
  keyboard?: boolean;
  zoom?: boolean;
}

export interface LazyCarousel {
  lazy: boolean;
  items?: number;
}

export interface AutoCarousel {
  auto: boolean;
  delay?: number;
  reverse?: boolean;
}

export interface NavigationCarousel {
  navigation: boolean;
  color?: 'accent' | 'primary';
  out?: boolean;
}

export interface PaginationCarousel {
  pagination: boolean;
  color?: 'accent' | 'primary';
  inside?: boolean;
}

@UntilDestroy()
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [IntersectionObserverModule, MatIconModule, ForModule, NgClass, NgIf, NgTemplateOutlet],
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
  navigationReady: boolean = false;
  leftNavigator: boolean = false;
  rightNavigator: boolean = true;
  firstIntersection: boolean = false;
  paginationSlide: boolean = false;
  lastTap: number = 0;

  options: CarouselOptions = {
    visibleItems: 1,
    loop: false,
    lazy: {
      lazy: false,
      items: 0,
    },
    navigation: {
      navigation: false,
    },
    spaceBetween: 1,
    carouselTwin: 'none',
    auto: {
      auto: false,
      delay: 1000,
      reverse: false,
    },
    pagination: {
      pagination: false,
    },
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
      Object.assign(config.lazy as LazyCarousel, this.options.lazy);
    }
    if (config.pagination) {
      Object.assign(this.options.pagination as PaginationCarousel, config.pagination);
      Object.assign(config.pagination as PaginationCarousel, this.options.pagination);
    }
    if (config.navigation) {
      Object.assign(this.options.navigation as NavigationCarousel, config.navigation);
      Object.assign(config.navigation as NavigationCarousel, this.options.navigation);
    }
    Object.assign(this.options, config);

    this.breakPointOptions = { ...this.options };

    if (this.breakPointOptions.breakpoints) {
      this.setBreakpointProperties();
    }
  }

  @Output() init = new EventEmitter();

  resize$ = fromEvent(this.windowRef, 'resize');

  ngAfterViewInit(): void {
    // TODO: Find a way to fix it
    if (!this.breakPointOptions.lazy?.lazy) {
      this.changeDetectorRef.detach();
    }

    this.setCarouselOptions();
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

    // Detect changes for all properties that depends on navigationReady
    if (this.breakPointOptions.navigation?.navigation) {
      this.navigationReady = true;
      this.detectChanges();
    }

    this.init.emit();
  }

  slide(left: boolean) {
    this.itemWidth =
      this.carousel.nativeElement.firstChild.offsetWidth +
      this.breakPointOptions.spaceBetween! * 16;

    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    const maxScroll =
      this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.offsetWidth;

    if (this.scrollLeft > maxScroll) {
      this.scrollLeft = maxScroll;
    }

    if (this.scrollLeft < maxScroll - maxScroll * 0.01 && (this.scrollLeft !== 0 || !left)) {
      this.scrollLeft += left ? -1 * this.itemWidth : this.itemWidth;
    } else if (1 - this.scrollLeft / maxScroll < 0.01 && this.scrollLeft !== 0) {
      if (this.breakPointOptions.loop) {
        this.scrollLeft = left ? this.scrollLeft + -1 * this.itemWidth : 0;
      } else if (left) {
        this.scrollLeft = this.scrollLeft + -1 * this.itemWidth;
      }
    } else if (this.scrollLeft === 0) {
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
      // Variant with all visible elements on the end
      this.lastVisibleElement =
        this.breakPointOptions.lazy!.items! + this.breakPointOptions.visibleItems!;
    }

    this.setCarouselOptions();
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

  setCarouselOptions() {
    if (this.carouselSection) {
      const carouselElement = this.carouselSection.nativeElement;
      const setCarouselProperty = (property: string, value: string | number) => {
        carouselElement.style.setProperty(property, value);
      };

      // Also used for virtual lazy loading variant
      this.visibleElements = [
        -1 * (this.breakPointOptions.lazy?.items ?? 0),
        this.breakPointOptions.visibleItems! + (this.breakPointOptions.lazy?.items ?? 0),
      ];

      this.leftNavigator = !!this.breakPointOptions.loop;

      setCarouselProperty('--visible-items', this.breakPointOptions.visibleItems!.toString());
      setCarouselProperty('--space', this.breakPointOptions.spaceBetween!.toString());
      if (this.breakPointOptions.navigation?.out) {
        setCarouselProperty('--width', '90%');
      }
      if (this.breakPointOptions.navigation?.navigation) {
        setCarouselProperty('--display-navigation', 'flex');
      }
    }
  }

  slideToItem(index: number) {
    if (this.focusItem !== index) {
      const item = this.carouselItems.find((el, i) => index === i);
      this.carousel.nativeElement.scrollLeft = item?.nativeElement.offsetLeft;
      this.paginationSlide = true;

      // While scrolling animation
      setTimeout(() => {
        this.paginationSlide = false;
      }, 600);
      this.focusPaginationItem(index);
    }
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
    event
      .filter(entry => entry.isIntersecting)
      .map(() => {
        // For zoom out
        if (this.breakPointOptions.zoom) {
          const item = this.carouselItems.find((el, index) => i === index)?.nativeElement
            .firstChild;
          if (item) item.style.transform = 'scale(1)';
        }

        // Variant like virtual scroll
        // const firstElement = this.visibleElements[0];
        // const lastElement = this.visibleElements[1];
        const visibleItems = this.breakPointOptions.visibleItems!;
        const offsetElements = this.breakPointOptions.lazy!.items!;

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

        // For scrolling pagination focus
        if (!this.paginationSlide) {
          // Detect first and last element
          const firstElement = this.visibleElements[0];
          const lastElement = this.visibleElements[1] - 1;

          if (!this.firstIntersection && i >= Math.round(visibleItems)) {
            this.firstIntersection = true;
          }

          if (i <= firstElement) {
            this.visibleElements[0] = i;
            this.visibleElements[1] = i + visibleItems;
            this.focusPaginationItem(i);
          }

          if (i >= lastElement && this.firstIntersection) {
            this.visibleElements[1] = i;
            this.visibleElements[0] = i - visibleItems + 1;
            this.focusPaginationItem(this.visibleElements[0]);
          }
        }

        // Variant with all visible elements on the end
        if (this.breakPointOptions.lazy?.lazy) {
          if (i + offsetElements >= this.lastVisibleElement) {
            this.lastVisibleElement = i + offsetElements;
          }
        }

        // For navigation
        // The idea is to detect changes only when it is really needed
        if (this.breakPointOptions.navigation?.navigation && !this.breakPointOptions.loop) {
          if (this.firstIntersection) {
            if ((i > 0 && !this.leftNavigator) || (i === 0 && this.leftNavigator)) {
              this.leftNavigator = !this.leftNavigator;
              this.detectChanges();
            }
            // (this.breakPointOptions.loop ? 1 : 0) for last pagination fix
            if (this.rightNavigator !== (i !== this.carouselItems.length - 1)) {
              this.rightNavigator = i !== this.carouselItems.length - 1;
              this.detectChanges();
            }
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

    if (this.breakPointOptions.pagination?.pagination) {
      if (index !== null) {
        this.focusItem = Math.round(index);
      } else {
        const newFocus = Math.round(this.scrollLeft / this.itemWidth);
        const lastItem = this.carouselItems.length - 1;
        this.focusItem = newFocus > lastItem ? lastItem : newFocus;
      }
    }

    if (focusedItem !== this.focusItem && !this.breakPointOptions.lazy?.lazy) {
      this.detectChanges();
    }
  }

  zoom(item: any, x: number, y: number) {
    item.style.transition = 'transform 200ms ease-in-out';

    if (!item.style.transform || item.style.transform === 'scale(1)') {
      let xZoom = x - item.getBoundingClientRect().left;
      let yZoom = y - item.getBoundingClientRect().top;

      const itemWidth = item.offsetWidth;
      const itemHeight = item.offsetHeight;

      xZoom = 100 - (xZoom / itemWidth) * 200;
      yZoom = 100 - (yZoom / itemHeight) * 200;

      item.style.transform = `translate(${xZoom}%, ${yZoom}%) scale(3)`;
    } else {
      item.style.transform = `scale(1)`;
    }
  }

  desktopZoom(event: MouseEvent, index: number) {
    if (this.breakPointOptions.zoom) {
      event.preventDefault();
      const item = this.carouselItems.find((el, i) => i === index)?.nativeElement.firstChild;
      this.zoom(item, event.x, event.y);
    }
  }

  detectDoubleTapClosure(event: TouchEvent, index: number) {
    const curTime = new Date().getTime();
    const tapLen = curTime - this.lastTap;
    if (tapLen < 1000 && tapLen > 0) {
      event.preventDefault();
      const item = this.carouselItems.find((el, i) => i === index)?.nativeElement.firstChild;
      this.zoom(item, event.touches[0].clientX, event.touches[0].clientY);
    } else {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 500);
    }
    this.lastTap = this.lastTap > 0 ? 0 : curTime;
  }

  get showNavigation() {
    if (this.breakPointOptions.navigation?.navigation) {
      const spaceBetween = this.breakPointOptions.spaceBetween!;
      const visibleItems = this.breakPointOptions.visibleItems!;

      return (
        visibleItems * (this.itemWidth + spaceBetween) - spaceBetween >
        this.carousel.nativeElement.offsetWidth
      );
    }

    return false;
  }

  detectChanges() {
    this.changeDetectorRef.detectChanges();
    console.log('detect changes');
  }

  get maxPaginationItems() {
    if (this.items) {
      return this.items.length - (this.breakPointOptions.visibleItems! - 1);
    }

    return;
  }

  get paginationInside() {
    return this.breakPointOptions.pagination?.inside;
  }

  get paginationColor() {
    const color = this.breakPointOptions.pagination?.color;
    if (color) {
      return color === 'accent' ? '!bg-orange-500' : '!bg-green-500';
    }
    return '!bg-white';
  }

  get breakpointTrigger() {
    return (
      this.windowRef.innerWidth > this.nextBreakpoint ||
      this.windowRef.innerWidth < this.prevBreakpoint
    );
  }

  get secondaryTwin(): boolean {
    return this.breakPointOptions.carouselTwin === 'secondary';
  }

  get mainTwin(): boolean {
    return this.breakPointOptions.carouselTwin === 'main';
  }
}
