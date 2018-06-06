function Player() {
	base(this, LSprite, []);
	var self = this;
	// self.hp = 200;
	self.name = "Player";
	self.list = ["ball"];
	self.bitmap = new LBitmap(new LBitmapData(imgData[self.list[0]]));
	self.addChild(self.bitmap);
	self.addBodyCircle(30, self.bitmap.getHeight() * 0.5, self.bitmap.getWidth() * 0.5, 1, 5, .4, .13);
}
