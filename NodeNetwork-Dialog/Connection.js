import { Circle } from './Circle.js';

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
        const [x1Adjusted, y1Adjusted] = Connection.offsetFrom(x2, y2, x1, y1, sourceRadius); 
        const [x2Adjusted, y2Adjusted] = Connection.offsetFrom(x1, y1, x2, y2, destinationRadius); 
        
        const style = line.element.style;
        style.left = x1Adjusted + "px";
        style.top = y1Adjusted + "px";
        style.width = Math.sqrt((x2Adjusted - x1Adjusted) ** 2 + (y2Adjusted - y1Adjusted) ** 2) + "px";
        style.transformOrigin = "left";
        style.transform = `rotate(${Math.atan2(y2Adjusted - y1Adjusted, x2Adjusted - x1Adjusted)}rad)`;
        
        const arrowhead = line.element.querySelector(".arrowhead");
        this.lookAt(arrowhead, x1, y1, x2, y2);
    }
    
    // Move to helper class
    static lookAt(element, referenceX, referenceY, targetX, targetY)
    {
        // Calculate the angle between two points
        const dx = targetX - referenceX;
        const dy = targetY - referenceY;
        const angle = Math.atan2(dy, dx);

        // Convert the angle from radians to degrees
        const angleInDegrees = angle * (180 / Math.PI);
        const offset = -90;

        // Apply rotation to the element
        element.style.transform = `rotate(${angle + offset}deg)`;
    }
    
    // Move to helper class
    static offsetFrom(referenceX, referenceY, targetX, targetY, distance)
    {
        const dx = targetX - referenceX;
        const dy = targetY - referenceY;
        const [nx, ny] = Connection.normalize(dx, dy);
        const x = targetX - (nx * distance);
        const y = targetY - (ny * distance);
        return [x, y];
    }

    // Move to helper class
    static normalize(x, y) 
    {
        const length = Math.sqrt(x * x + y * y);
        
        if (length !== 0) 
        {
            const normalizedX = x / length;
            const normalizedY = y / length;
            return [normalizedX, normalizedY];
        } 
        else 
        {
            // Handle the case where the vector has zero length
            return [0, 0];
        }
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



// Add data attributes to the line to store circle IDs
//line.dataset.sourceCircle = this.sourceCircle.id;
//line.dataset.destinationCircle = this.destinationCircle.id;

/*line.element.style.left = x1 + "px";
line.element.style.top = y1 + "px";
line.element.style.width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) + "px";
line.element.style.transformOrigin = "left";
line.element.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;*/

/*
    static calculateEdgePoint(x1, y1, x2, y2, circleRadius) 
    {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const xAdjusted = x1 + Math.cos(angle) * circleRadius;
        const yAdjusted = y1 + Math.sin(angle) * circleRadius;
        return [xAdjusted, yAdjusted];
    }
 */