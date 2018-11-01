import 'phaser';

export class ClickableText extends Phaser.GameObjects.Text {
  constructor(config) {
    super(config.scene, config.x, config.y, config.text, config.style);
    this.originalStyle = config.style;
    this.hoverStyle = config.hoverStyle;
    this.callback = config.callback;

    this.setInteractive({ useHandCursor: true });
    console.log(this.style);

    this.on('pointerover', () => {
      this.setStyle(this.hoverStyle);
    });

    this.on('pointerout', () => {
      this.setStyle(this.originalStyle);
    });

    this.on('pointerdown', this.callback);
  }
}

export class Button extends Phaser.GameObjects.Container {
  constructor(config) {
    console.log("Button config:", config);
    super(config.scene, config.x, config.y);
    this.width = config.width;
    this.height = config.height;
    this.buttonWidth = config.width;
    this.buttonHeight = config.height;
    this.scene = config.scene;
    this.text = config.text;
    this.originalColor = config.originalColor;
    this.hoverColor = config.hoverColor;
    this.downColor = config.downColor;
    this.originalBorder = config.originalBorder;
    this.hoverBorder = config.hoverBorder;
    this.downBorder = config.downBorder;
    this.alpha = config.alpha;
    this.callback = config.callback;

    this.graphics = this.scene.add.graphics(0, 0);
    this.rect = null;
    this.add(this.graphics);

    this.draw(this.originalColor, this.originalBorder);

    const text = this.scene.add.text(
      this.width / 2,
      this.height / 4,
      this.text,
      {
        fontSize: "16px",
        fontFamily: "Georgia, serif",
        color: "#aaaa22",
        align: "center",
      });
    text.depth = 501;
    text.setOrigin(0.5, 0);
    this.add(text);
    console.log(text);

    this.hitZone = this.scene.add.zone(0, 0, this.width, this.height);
    this.hitZone.setOrigin(0);

    this.hitZone.setInteractive({cursor: "pointer"});
    this.add(this.hitZone);

    this.hitZone.on('pointerover', () => {
      this.draw(this.hoverColor, this.hoverBorder);
    });

    this.hitZone.on('pointerout', () => {
      this.draw(this.originalColor, this.originalBorder);
    });

    this.hitZone.on('pointerdown', () => {
      this.draw(this.downColor, this.downBorder);
    });

    this.hitZone.on('pointerup', () => {
      this.draw(this.hoverColor, this.hoverBorder);
      this.scene.time.delayedCall(100, this.callback, {}, this);
    }); //*/
  }

  draw(color, border) {
    this.graphics.clear();
    this.graphics.fillStyle(color, this.alpha);
    this.graphics.fillRect(0, 0, this.buttonWidth, this.buttonHeight);

    this.graphics.lineStyle(1, border, this.alpha);
    this.graphics.strokeRect(0, 0, this.buttonWidth, this.buttonHeight);
  }


}