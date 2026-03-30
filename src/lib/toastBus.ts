type Listener = (command: string, response?: string) => void;

const listeners = new Set<Listener>();

export const toastBus = {
  emit(command: string, response?: string) {
    listeners.forEach((l) => l(command, response));
  },
  on(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

/** Generates sudo-style command strings for common actions */
export const sudoCmd = {
  addToCart(slug: string, qty: number) {
    return `$ sudo apt install ${slug} --qty=${qty}`;
  },
  removeFromCart(slug: string) {
    return `$ sudo apt remove ${slug}`;
  },
  updateQty(slug: string, qty: number) {
    return `$ sudo apt update ${slug} --qty=${qty}`;
  },
  checkout(total: string) {
    return `$ sudo checkout --total=$${total} --confirm`;
  },
  login() {
    return "$ sudo -i";
  },
  viewAccount() {
    return "$ sudo -l";
  },
  bulkOrder(slug: string, qty: number) {
    return `$ sudo apt install ${slug} --qty=${qty} --bulk`;
  },
  clearCart() {
    return "$ sudo apt autoremove --purge";
  },
  preorder(slug: string) {
    return `$ sudo apt install ${slug} --pre-release`;
  },
  review(slug: string) {
    return `$ sudoedit /reviews/${slug}`;
  },
  ask(slug: string) {
    return `$ sudo -s /qa/${slug}`;
  },
};
