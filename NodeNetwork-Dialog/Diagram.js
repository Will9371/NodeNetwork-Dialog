import { Circle } from './Circle.js';
import { Connection} from './Connection.js';

class Diagram
{
	constructor()
	{
		this.currentMode = "add_delete";
		this.isFollowing = false;
		this.followCircle = null;
		this.selectedCircle = null;
		this.circleCount = 0;
		
		this.overlay = document.getElementById("overlay");
		this.radioContainer = document.getElementById("radio-container");
		this.radioButtons = document.querySelectorAll('input[name="mode"]');

		// Prevent clicks on the overlay from affecting circles
		overlay.addEventListener("mousedown", (e) => e.stopPropagation());

		this.radioButtons.forEach((radio) =>
		{
			radio.addEventListener("change", (e) =>
			{
				currentMode = e.target.value;
				if (selectedCircle)
				{
					selectedCircle.classList.remove("following-circle"); // Change circle color back to blue
					selectedCircle = null;
				}
			});
		});
	}

	handleMouseDown = (e) => 
	{
		switch (this.currentMode)
		{
			case "move": this.moveClick(e); break;
			case "add_delete": this.addDeleteClick(e); break;
			case "connect": this.connectClick(e); break;
			default: break;
		}
	};

	handleMouseMove = (e) =>
	{
		if (this.currentMode === "move" && this.isFollowing && this.followCircle)
		{
			this.followCircle.style.left = e.clientX - this.followCircle.clientWidth / 2 + "px";
			this.followCircle.style.top = e.clientY - this.followCircle.clientHeight / 2 + "px";
			this.updateLines(this.followCircle);
		}
	};

	handleKeyDown = (e) =>
	{
		switch (e.key)
		{
			case "z": this.setCurrentMode("move"); break;
			case "x": this.setCurrentMode("add_delete"); break;
			case "c": this.setCurrentMode("connect"); break;
			default: break;
		}
	};

	attachEventListeners() 
	{
		document.addEventListener("mousedown", this.handleMouseDown);
		document.addEventListener("mousemove", this.handleMouseMove);
		document.addEventListener("keydown", this.handleKeyDown);
	}

	// Left-click in "Move" mode
	moveClick(e)
	{
		if (e.target.classList.contains("circle"))
		{
			// Left-click on an existing circle
			if (!this.isFollowing)
			{
				this.followCircle = e.target;
				this.followCircle.classList.add("following-circle"); // Change circle color to aqua
				this.isFollowing = true;
			}
			else
			{
				this.isFollowing = false;
				this.followCircle.classList.remove("following-circle"); // Change circle color back to blue
				this.followCircle = null;
			}
		}
	}

	// Left-click in "Add/Delete" mode
	addDeleteClick(e)
	{
		// Prevent circle creation when clicking inside the overlay or on radio buttons
		if (e.target === overlay || e.target.parentElement === this.radioContainer || e.target.value === "move" || e.target.value === "connect")
			return;
		
		// Left-click on an existing circle to remove it
		if (e.target.classList.contains("circle"))
		{
			this.deleteLinesForCircle(e.target);
			e.target.remove();
		}
		// Left-click on blank part of the screen to create a new circle
		else
			this.selectedCircle = this.createCircle(e.clientX, e.clientY);
	}
	
	// Left-click in "Connect" mode
	connectClick(e)
	{
		if (e.target.classList.contains("circle"))
		{
			// Left-click on a circle in "Connect" mode
			if (!this.selectedCircle)
			{
				// The selectedCircle is already set when creating the circle in "add_delete" mode
				this.selectedCircle = e.target.circleObject;

				// Change circle color to aqua
				this.selectedCircle.element.classList.add("following-circle");
			}
			else if (this.selectedCircle.element !== e.target)
			{
				this.connectCircles(this.selectedCircle, e.target.circleObject);
				this.selectedCircle.element.classList.remove("following-circle");
				this.selectedCircle = null;
			}
		}
	}

	// Update the current mode and select the corresponding radio button
	setCurrentMode(mode)
	{
		this.currentMode = mode;
		const selectedRadioButton = document.querySelector(`input[name="mode"][value="${mode}"]`);
		
		if (selectedRadioButton)
			selectedRadioButton.checked = true;
		if (this.selectedCircle)
		{
			this.selectedCircle.element.classList.remove("following-circle");
			this.selectedCircle = null;
		}
	}

	updateLines(circle)
	{
		const connectedLines = document.querySelectorAll(".line");
		connectedLines.forEach((line) =>
		{
			const circle1 = line.dataset.circle1;
			const circle2 = line.dataset.circle2;
	
			if (circle1 === circle.id || circle2 === circle.id)
			{
				const x1 = circle.offsetLeft + circle.clientWidth / 2;
				const y1 = circle.offsetTop + circle.clientHeight / 2;
	
				const otherCircleId = circle1 === circle.id ? circle2 : circle1;
				const otherCircle = document.getElementById(otherCircleId);
	
				const x2 = otherCircle.offsetLeft + otherCircle.clientWidth / 2;
				const y2 = otherCircle.offsetTop + otherCircle.clientHeight / 2;
	
				Connection.setEndpoints(line, x1, y1, x2, y2);
			}
		});
	}

	createCircle(x, y) 
	{
		this.circleCount++;
		
		const newCircle = new Circle(x, y, this.circleCount);
		newCircle.element.circleObject = newCircle; // Attach the Circle object to the DOM element
		this.selectedCircle = newCircle;
		
		return newCircle;
	}

	connectCircles(circle1, circle2) 
	{
		const connection = new Connection(circle1, circle2);

		// Update the lines after connecting the circles
		this.updateLines(circle1.element);
		this.updateLines(circle2.element);

		return connection;
	}

	// Find an existing line between two circles (return null if none found)
	findExistingLine(circle1, circle2)
	{
		const connectedLines = document.querySelectorAll(".line");
		for (const line of connectedLines)
		{
			const lineCircle1 = document.getElementById(line.dataset.circle1);
			const lineCircle2 = document.getElementById(line.dataset.circle2);
	
			if ((lineCircle1 === circle1 && lineCircle2 === circle2) ||
				(lineCircle1 === circle2 && lineCircle2 === circle1))
				return line;
		}
		return null;
	}

	// Delete lines connected to a circle
	deleteLinesForCircle(circle)
	{
		const connectedLines = document.querySelectorAll(".line");
		for (const line of connectedLines)
		{
			const lineCircle1 = document.getElementById(line.dataset.circle1);
			const lineCircle2 = document.getElementById(line.dataset.circle2);
	
			if (lineCircle1 === circle || lineCircle2 === circle)
				line.remove();
		}
	}
}

export { Diagram };