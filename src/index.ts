import express, { Request, Response } from 'express';
import cors from 'cors';
import { createCanvas, Canvas } from 'canvas';

const app = express();
const port = process.env.PORT || 3001;

// Use CORS middleware
app.use(cors());

app.use(express.json());

// Utility function to generate a random color
function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Utility function to draw a random icon (simple shapes)
function drawIcon(context: CanvasRenderingContext2D, x: number, y: number, shapeType: number): void {
    context.fillStyle = getRandomColor();
    switch (shapeType) {
        case 0:

            // Draw a circle
            context.beginPath();
            context.arc(x, y, 50, 0, 2 * Math.PI);
            context.fill();
            break;
        case 1:

            // Draw a rectangle
            context.fillRect(x - 50, y - 50, 100, 100);
            break;
        case 2:


            // Draw a triangle
            context.beginPath();
            context.moveTo(x, y - 50);
            context.lineTo(x - 50, y + 50);
            context.lineTo(x + 50, y + 50);
            context.closePath();
            context.fill();
            break;
    }
}

// Function to generate a logo image
function generateLogo(prompt: string, fontSize: number, backgroundColor: string, textColor: string, shapeType: number): Canvas {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;

    // Background color
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    // Draw the specified icon
    drawIcon(context, width / 2, height / 2 - 50, shapeType);

    // Text style
    context.font = `${fontSize}px Arial`;
    context.fillStyle = textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw the prompt as text in the center of the canvas
    context.fillText(prompt, width / 2, height / 2 + 80); // Adjust position to fit text below icon

    return canvas;
}

app.post('/generate-logo', async (req: Request, res: Response) => {
    const { prompt, fontSize, backgroundColor, textColor, shapeType } = req.body;

    if (!prompt || !fontSize || !backgroundColor || !textColor || shapeType === undefined) {
        return res.status(400).json({ error: 'All parameters are required' });
    }

    try {
        const canvas = generateLogo(prompt, fontSize, backgroundColor, textColor, shapeType);
        const buffer = canvas.toBuffer('image/png');
        const base64Image = buffer.toString('base64');
        const imgSrc = `data:image/png;base64,${base64Image}`;

        return res.json({ logo: imgSrc });
    } catch (error) {
        console.error('Error generating logo:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
