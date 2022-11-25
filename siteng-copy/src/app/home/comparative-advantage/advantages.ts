export interface ComparativeAdvantage {
  title: string;
  icon: {
    custom?: boolean;
    key: string;
  };
  description: string;
  link: {
    internal?: string;
    external?: string;
  };
}


export const advantages: ComparativeAdvantage[] = [
  {
    title: 'Pitaj pravnika',
    icon: {
      key: 'pitaj-pravnika',
      custom: true
    },
    description: 'Imaš pravno pitanje vezano za nekretninu? Naš pravnik je tu da ti pomogne i odgovori na tvoju dilemu.',
    link: {external: 'https://www.4zida.rs/blog/pitaj-pravnika/'}
  },
  {
    title: 'Kako se kreću cene nekretnina?',
    icon: {
      key: 'query_stats'
    },
    description: 'Prosečne cene, kretanje cena kuća i stanova, cene stanarina po krajevima na tržištu u Srbiji - sve na jednom mestu!',
    link: {external: 'https://4zida.rs/kretanje-cene-nekretnina'}
  },
  {
    title: 'Opremanje nekretnine',
    icon: {
      key: 'chair'
    },
    description: 'Kalkulator opremanja nekretnine nameštajem i tehnikom - odaberi, uzmi kredit, informiši se.',
    link: {external: 'https://4zida.rs/opremanje-namestajem-i-tehnikom'}
  },
  {
    title: 'Kalkulator kredita i osiguranja',
    icon: {
      key: 'savings'
    },
    description: 'Unesite parametre i saznajte uslove pod kojima možete kupiti nekretninu na kredit.',
    link: {external: 'https://www.4zida.rs/kalkulator-stambenih-kredita-i-osiguranja'}
  },
  {
    title: 'Kalkulator kreditne sposobnosti',
    icon: {
      key: 'credit_score'
    },
    description: 'Proveri svoju kreditnu sposobnost pre nego što se upustiš u avanturu traženja nekretnine.',
    link: {external: 'https://www.4zida.rs/kreditna-sposobnost'}
  },
  {
    title: 'Vodiči za ponudu i potražnju',
    icon: {
      key: 'signpost'
    },
    description: 'Popisali smo korake, situacije i detalje  na koje trebate da obratite pažnju kako bi ceo proces bio uspešan.',
    link: {external: 'https://www.4zida.rs/blog/4zida-vodici/'}
  },
];
