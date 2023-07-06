import { Circle } from './Circle.js';
import { Connection} from './Connection.js';

class Diagram
{
	constructor()
	{
		this.currentMode = "add_delete";
		this.followCircle = null;
		this.circleCount = 0;
		this.connections = [];
		this.selectedCircle = null;

		// Prevent clicks on the overlay from affecting circles
		this.overlay = document.getElementById("overlay");
		this.overlay.addEventListener("mousedown", (e) => e.stopPropagation());

		// Listen to the modeChange event from ModeSelector
		this.modeChangeHandler = this.handleModeChange.bind(this);
		document.addEventListener("modeChange", this.modeChangeHandler);
		
		this.setSelectedCircle(null);
	}

	// Remove event listener when Diagram is no longer needed
	destroy() 
	{
		document.removeEventListener("modeChange", this.modeChangeHandler);
	}

	handleModeChange(event) 
	{
		const mode = event.detail.mode;
		this.setCurrentMode(mode);
	}

	handleMouseDown = (e) => 
	{
		switch (this.currentMode)
		{
			case "move": this.moveClick(e); break;
			case "add_delete": this.addDeleteClick(e); break;
			case "connect": this.connectClick(e); break;
			case "view": this.viewClick(e); break;
			default: break;
		}
	};

	handleMouseMove = (e) =>
	{
		if (this.currentMode === "move" && this.followCircle)
		{
			this.followCircle.element.style.left = e.clientX - this.followCircle.element.clientWidth / 2 + "px";
			this.followCircle.element.style.top = e.clientY - this.followCircle.element.clientHeight / 2 + "px";
			this.updateLines(this.followCircle);
		}
	};

	attachEventListeners() 
	{
		document.addEventListener("mousedown", this.handleMouseDown);
		document.addEventListener("mousemove", this.handleMouseMove);
	}

	// Left-click in "Move" mode
	moveClick(e)
	{
		if (!e.target.classList.contains("circle"))
			return;
		
		// Left-click on an existing circle
		if (this.followCircle === null)
		{
			this.setSelectedCircle(e.target.circleObject);
			this.followCircle = e.target.circleObject;
		}
		else
		{
			this.setSelectedCircle(null);
			this.followCircle = null;
		}
	}

	// Left-click in "Add/Delete" mode
	addDeleteClick(e)
	{
		// Prevent circle creation when clicking inside the overlay or on radio buttons
		if (e.target === this.overlay || e.target.parentElement === this.radioContainer 
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
			this.setSelectedCircle(this.createCircle(e.clientX, e.clientY));
	}
	
	// Left-click in "Connect" mode
	connectClick(e)
	{
		if (!e.target.classList.contains("circle"))
			return;
		
		if (!this.selectedCircle)
			this.setSelectedCircle(e.target.circleObject);
		else if (this.selectedCircle.element !== e.target)
		{
			this.connectCircles(this.selectedCircle, e.target.circleObject);
			this.setSelectedCircle(null);
		}
	}

	viewClick(e)
	{
		if (e.target.classList.contains("circle"))
			this.setSelectedCircle(e.target.circleObject);
	}

	// Update the current mode and select the corresponding radio button
	setCurrentMode(mode)
	{
		this.currentMode = mode;
		const selectedRadioButton = document.querySelector(`input[name="mode"][value="${mode}"]`);
		
		if (selectedRadioButton)
			selectedRadioButton.checked = true;
		
		// Deselect circle on changing mode
		if (this.selectedCircle)
			this.setSelectedCircle(null);

		// Raise the modeChange event with the new mode
		const event = new CustomEvent("modeChanged", { detail: { mode } });
		document.dispatchEvent(event);
	}

	updateLines(circle)
	{
		const connectedLines = document.querySelectorAll(".line");
		connectedLines.forEach((line) => { Connection.requestSetEndpoints(line.lineObject, circle); });
	}

	createCircle(x, y) 
	{
		this.circleCount++;
		
		const newCircle = new Circle(x, y, this.circleCount);
		newCircle.element.circleObject = newCircle; // Attach the Circle object to the DOM element
		this.setSelectedCircle(newCircle);
		
		return newCircle;
	}

	setSelectedCircle(circle) 
	{
		this.selectedCircle?.element?.classList.remove("selected-circle");
		circle?.element?.classList.add("selected-circle");
		
		this.selectedCircle = circle;

		// Dispatch "selectionChanged" event whenever the selected circle changes
		const selectionEvent = new CustomEvent("selectionChanged", { detail: { selectedCircle: this.selectedCircle } });
		document.dispatchEvent(selectionEvent);
	}

	connectCircles(sourceCircle, destinationCircle) 
	{
		// If a connection already exists, remove it
		if (this.removeConnection(sourceCircle, destinationCircle))
			return;
	
		const connection = new Connection(sourceCircle, destinationCircle);

		// Update the lines after connecting the circles
		this.updateLines(sourceCircle);
		this.updateLines(destinationCircle);

		this.connections.push(connection);
		return connection;
	}
	
	removeConnection(sourceCircle, destinationCircle) 
	{
		const index = this.findConnectionIndex(sourceCircle, destinationCircle);
		
		if (index !== -1)
		{
			this.connections[index].remove();
			this.connections.splice(index, 1);
		}
		return index !== -1;
	}

	findConnectionIndex(sourceCircle, destinationCircle)
	{
		let index = 0;
		for (const connection of this.connections)
		{
			if (connection.sourceCircle.id === sourceCircle.id && connection.destinationCircle.id === destinationCircle.id ||
				connection.sourceCircle.id === destinationCircle.id && connection.destinationCircle.id === sourceCircle.id)
				return index;
				
			index++;
		}
		return -1;
	}

	// Delete lines connected to a circle
	deleteLinesForCircle(circle)
	{
		if (!(circle instanceof Circle))
			circle = circle.circleObject;
	
		const connectedLines = document.querySelectorAll(".line");
		for (const line of connectedLines)
		{
			const lineSource = line.lineObject.sourceCircle;  
			const lineDestination = line.lineObject.destinationCircle;
			
			if (lineSource === circle || lineDestination === circle)
				this.removeConnection(lineSource, lineDestination);
		}
	}
}

export { Diagram };