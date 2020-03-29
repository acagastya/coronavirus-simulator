class Person {
  constructor() {
    this.x = 10 + Math.random() * (w - 10);
    this.y = 10 + Math.random() * (h - 10);
    this.velocity = {};
    this.velocity.x = Math.random() * 5;
    this.velocity.y = Math.random() * 5;
  }
  show() {
    if (this.x < 10.2 || this.x > w - 10.2) this.velocity.x = -this.velocity.x;
    if (this.y < 10.2 || this.y > h - 10.2) this.velocity.y = -this.velocity.y;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    circle(this.x, this.y, 10);
  }
}
