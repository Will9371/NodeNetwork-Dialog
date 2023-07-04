class Circle 
{
	constructor(x, y, circleCount) 
	{
		this.x = x;
		this.y = y;
		this.id = `circle_${circleCount}`;
		this.element = this.createElement();
		this.element.circleObject = this;
	}

	createElement() 
	{
		//console.log("1");
		const newCircle = document.createElement("div");
		newCircle.classList.add("circle", "new-circle");
		newCircle.style.left = this.x - 40 + "px"; // Half of the width 
		newCircle.style.top = this.y - 40 + "px";  // Half of the height 
		newCircle.id = this.id;
		document.body.appendChild(newCircle);
		return newCircle;
	}

	remove() 
	{
		this.element.remove();
	}
}

export { Circle };