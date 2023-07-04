class Connection 
{
    constructor(circle1, circle2) 
    {
        this.circle1 = circle1;
        this.circle2 = circle2;
        this.element = this.createElement();

        // Calculate the center coordinates of the circles
        const x1 = this.circle1.x + this.circle1.element.clientWidth / 2;
        const y1 = this.circle1.y + this.circle1.element.clientHeight / 2;
        const x2 = this.circle2.x + this.circle2.element.clientWidth / 2;
        const y2 = this.circle2.y + this.circle2.element.clientHeight / 2;
        
        Connection.setEndpoints(this.element, x1, y1, x2, y2);
    }
    
    createElement()
    {
        const line = document.createElement("div");
        line.classList.add("line");
        
        // Add data attributes to the line to store circle IDs
        line.dataset.circle1 = this.circle1.id;
        line.dataset.circle2 = this.circle2.id;
        
        document.body.appendChild(line);
        return line;
    }

    // Set the line's starting and ending points
    static setEndpoints(line, x1, y1, x2, y2)
    {
        line.style.left = x1 + "px";
        line.style.top = y1 + "px";
        line.style.width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) + "px";
        line.style.transformOrigin = "left";
        line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
    }
    
    remove() 
    {
        this.element.remove();
    }
}

export { Connection };