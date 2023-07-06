class Vector
{
    static lookAt(element, referenceX, referenceY, targetX, targetY, offsetAngle)
    {
        // Calculate the angle between two points
        const dx = targetX - referenceX;
        const dy = targetY - referenceY;
        const angle = Math.atan2(dy, dx);

        // Convert the angle from radians to degrees
        const angleInDegrees = angle * (180 / Math.PI);

        // Apply rotation to the element
        element.style.transform = `rotate(${angle + offsetAngle}deg)`;
    }

    static offsetFrom(referenceX, referenceY, targetX, targetY, distance)
    {
        const dx = targetX - referenceX;
        const dy = targetY - referenceY;
        const [nx, ny] = this.normalize(dx, dy);
        const x = targetX - (nx * distance);
        const y = targetY - (ny * distance);
        return [x, y];
    }

    static normalize(x, y)
    {
        const length = Math.sqrt(x * x + y * y);

        if (length !== 0)
        {
            const normalizedX = x / length;
            const normalizedY = y / length;
            return [normalizedX, normalizedY];
        }
        // Handle the case where the vector has zero length
        else
            return [0, 0];
    }

}

export { Vector };