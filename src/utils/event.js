class Observer {
  constructor() {
    this.observers = {};
  }

  subscribe(type, fn) {
    if (this.observers[type]) {
      this.observers[type].push(fn);
    } else {
      this.observers[type] = [fn];
    }
  }

  unsubscribe(type, fn) {
    if (this.observers[type]) {
      this.observers[type] = this.observers[type].filter((subscriber) => subscriber !== fn);
    }
  }

  fire(type, data) {
    if (this.observers[type]) {
      this.observers[type].forEach((subscriber) => subscriber(data));
    }
  }
}

export const Event = new Observer();
