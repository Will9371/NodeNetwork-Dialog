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
		this.connections = [];
		
		this.overlay = document.getElementById("overlay");
		this.radioContainer = document.getElementById("radio-container");
		this.radioButtons = document.querySelectorAll('input[name="mode"]');

		// Prevent clicks on the overlay from affecting circles
		overlay.addEventListener("mousedown", (e) => e.stopPropagation());

		this.radioButtons.forEach((radio) => 
			{ radio.addEventListener("change", (e) => 
				{ this.setCurrentMode(e.target.value);}); });
	}

	handleKeyDown = (e) =>
	{
		switch (e.key)
		{
			case "z": this.setCurrentMode("move"); break;
			case "x": this.setCurrentMode("add_delete"); break;
			case "c": this.setCurrentMode("connect"); break;
			case "v": this.setCurrentMode("view"); break;
			default: break;
		}
	};

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
		if (e.target === overlay || e.target.parentElement === this.radioContainer 
			|| e.target.value === "move" || e.target.value === "connect" || e.target.value === "view")
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
			
		// Change circle color back to blue	
		if (this.selectedCircle)
		{
			this.selectedCircle.element.classList.remove("following-circle");
			this.selectedCircle = null;
		}

		// Raise the modeChange event with the new mode
		const event = new CustomEvent("modeChanged", { detail: { mode } });
		document.dispatchEvent(event);
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
		// If a connection already exists, remove it
		if (this.removeConnection(circle1, circle2))
			return;
	
		const connection = new Connection(circle1, circle2);

		// Update the lines after connecting the circles
		this.updateLines(circle1.element);
		this.updateLines(circle2.element);

		this.connections.push(connection);
		return connection;
	}
	
	removeConnection(circle1, circle2) 
	{
		const index = this.findConnectionIndex(circle1, circle2);
		
		if (index !== -1)
		{
			this.connections[index].remove();
			this.connections.splice(index, 1);
		}
		return index !== -1;
	}

	findConnectionIndex(circle1, circle2)
	{
		let index = 0;
		for (const connection of this.connections)
		{
			if (connection.circle1.id === circle1.id && connection.circle2.id == circle2.id ||
				connection.circle1.id === circle2.id && connection.circle2.id === circle1.id)
				return index;
				
			index++;
		}
		return -1;
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
				this.removeConnection(lineCircle1, lineCircle2);
		}
	}
}

export { Diagram };