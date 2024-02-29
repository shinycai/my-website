class Environment {
  constructor() {
    this.name = 'live';
    this.external = true;
    this.cmsPath = window.hlx?.cmsBasePath || '/cms';
    this.libPath = window.hlx?.libraryBasePath || '/lib';
    this.codePath = window.hlx?.codeBasePath || '';
  }

  isLocal() { return this.name === 'local'; }

  isLive() { return this.name === 'live'; }

  isProd() { return this.external; }

  isNonProd() { return !this.external; }

  isReviews() { return this.name === 'reviews'; }

  isPage() { return this.name === 'page'; }
}

export const Env = new Environment();
