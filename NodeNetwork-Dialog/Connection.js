import { Circle } from './Circle.js';
import { Vector } from './Vector.js';

class Connection 
{
    constructor(sourceCircle, destinationCircle) 
    {
        if (!(sourceCircle instanceof Circle)) 
        {
            console.error("Invalid sourceCircle parameter. Expected a Circle object.");
            return;
        }
        if (!(destinationCircle instanceof Circle))
        {
            console.error("Invalid destinationCircle parameter. Expected a Circle object.");
            return;
        }

        this.sourceCircle = sourceCircle;
        this.destinationCircle = destinationCircle;
        this.element = this.createElement();
        this.element.lineObject = this;

        // Calculate the center coordinates of the circles
        const x1 = this.sourceCircle.x + this.sourceCircle.element.clientWidth / 2;
        const y1 = this.sourceCircle.y + this.sourceCircle.element.clientHeight / 2;
        const x2 = this.destinationCircle.x + this.destinationCircle.element.clientWidth / 2;
        const y2 = this.destinationCircle.y + this.destinationCircle.element.clientHeight / 2;

        this.arrowhead = this.createArrowhead();
        this.element.appendChild(this.arrowhead);
        
        Connection.setEndpoints(this, x1, y1, x2, y2);
    }
    
    createElement()
    {
        const line = document.createElement("div");
        line.classList.add("line");
        document.body.appendChild(line);
        return line;
    }

    // Set the line's starting and ending points
    static setEndpoints(line, x1, y1, x2, y2)
    {
        const sourceRadius = line.sourceCircle.element.clientWidth / 2;
        const destinationRadius = line.destinationCircle.element.clientWidth / 2;

        // Calculate the coordinates of the points where the lines touch the circles
        const [x1Adjusted, y1Adjusted] = Vector.offsetFrom(x2, y2, x1, y1, sourceRadius); 
        const [x2Adjusted, y2Adjusted] = Vector.offsetFrom(x1, y1, x2, y2, destinationRadius); 
        
        const style = line.element.style;
        style.left = x1Adjusted + "px";
        style.top = y1Adjusted + "px";
        style.width = Math.sqrt((x2Adjusted - x1Adjusted) ** 2 + (y2Adjusted - y1Adjusted) ** 2) + "px";
        style.transformOrigin = "left";
        style.transform = `rotate(${Math.atan2(y2Adjusted - y1Adjusted, x2Adjusted - x1Adjusted)}rad)`;
        
        const arrowhead = line.element.querySelector(".arrowhead");
        Vector.lookAt(arrowhead, x1, y1, x2, y2, -90);
    }
    
    static requestSetEndpoints(connection, circle) 
    {
        const sourceCircle = connection.sourceCircle;
        const destinationCircle = connection.destinationCircle;

        if (sourceCircle !== circle && destinationCircle !== circle) 
            return;
        
        // Calculate the current x and y positions based on the initial position and any CSS transforms
        const computedStyle = window.getComputedStyle(circle.element);
        const currentX = parseInt(computedStyle.left);
        const currentY = parseInt(computedStyle.top);
    
        const x1 = destinationCircle.element.offsetLeft + destinationCircle.element.clientWidth / 2;
        const y1 = destinationCircle.element.offsetTop + destinationCircle.element.clientHeight / 2;

        const x2 = sourceCircle.element.offsetLeft + sourceCircle.element.clientWidth / 2;
        const y2 = sourceCircle.element.offsetTop + sourceCircle.element.clientHeight / 2;

        Connection.setEndpoints(connection, x1, y1, x2, y2);
    }
    
    createArrowhead() 
    {
        const arrowhead = document.createElement("div");
        arrowhead.classList.add("arrowhead");
        return arrowhead;
    }
    
    remove() 
    {
        this.element.remove();
    }
}

export { Connection };