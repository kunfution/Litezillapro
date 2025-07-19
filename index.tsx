

// --- CONSTANTS ---
const MASK_COLOR = 'mask';
const MASK_DISPLAY_COLOR = '#888888';

const LIMITED_PALETTE = [
    '#222222', // Near Black
    '#ffffff', // White
    '#ff0000', // Red
    '#ff9a0d', // Orange
    '#ffff00', // Yellow
    '#29ff0f', // Lime Green
    '#0f8d0f', // Green
    '#0f49ff', // Blue
    '#0fffff', // Cyan
    '#ffb3d7', // Pink
    '#9a0f9a', // Purple
];

const RAINBOW_PALETTE = [
    '#ff0000', // Red
    '#ff9a0d', // Orange
    '#ffff00', // Yellow
    '#29ff0f', // Lime
    '#0f49ff', // Blue
    '#9a0f9a', // Purple
];

const CANVAS_DOT_COLOR_FOR_BLACK = '#333333'; // Make black dots visible on black bg

const SMALL_CIRCLE_PATTERNS = {
    2: [[0,0], [1,0], [0,1], [1,1]],
    3: [[0,1], [1,0], [1,1], [1,2], [2,1]],
    4: [[0,1],[0,2],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,1],[3,2]],
    5: [[0,2],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[4,2]],
};


// --- DOM ELEMENTS ---
const uploadInput = document.getElementById('upload-input') as HTMLInputElement;
const fileBtn = document.querySelector('.file-btn') as HTMLButtonElement;
const fileNameSpan = document.querySelector('.file-name') as HTMLSpanElement;
const sizeSelect = document.getElementById('size-select') as HTMLSelectElement;
const canvas = document.getElementById('pixel-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const canvasWrapper = document.querySelector('.canvas-wrapper') as HTMLDivElement;
const originalImagePreview = document.getElementById('original-image-preview') as HTMLDivElement;
const sourceImageEl = document.getElementById('source-image') as HTMLImageElement;
const colorPaletteContainer = document.getElementById('color-palette') as HTMLDivElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const scaleSlider = document.getElementById('scale-slider') as HTMLInputElement;
const colorDetailSlider = document.getElementById('color-detail-slider') as HTMLInputElement;
const panModeBtn = document.getElementById('pan-mode-btn') as HTMLButtonElement;
const brushToolSelect = document.getElementById('brush-tool-select') as HTMLSelectElement;
const brushSizeInput = document.getElementById('brush-size') as HTMLInputElement;
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement;
const generateBgBtn = document.getElementById('generate-bg-btn') as HTMLButtonElement;
const strokeSelectionBtn = document.getElementById('stroke-selection-btn') as HTMLButtonElement;
const canvasPreview = document.getElementById('canvas-preview') as HTMLCanvasElement;
const ctxPreview = canvasPreview?.getContext('2d');


// --- APP STATE ---
let originalImage: HTMLImageElement | null = null;
let gridWidth = 51;
let gridHeight = 26;
let pixelData: string[][] = []; // 2D array of hex color strings
let generatedBackgroundData: string[][] | null = null; // Temp layer for masked generation
let historyStack: string[][][] = [];
let redoStack: string[][][] = [];
const MAX_HISTORY_SIZE = 50;
let selectedColor: string = LIMITED_PALETTE[1]; // Default to white
let resizeAnimationFrameId: number | null = null;
let labPaletteCache: { hex: string, lab: { l: number, a: number, b: number } }[] = [];


// Transform and Drawing State
let scale = 1.0;
let panOffset = { x: 0, y: 0 };
let isPanMode = false;
let isDragging = false; // For panning
let isDrawing = false; // For drawing tools
let dragStart = { x: 0, y: 0 };

// --- CORE FUNCTIONS ---

function init() {
    fileBtn.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', handleImageUpload);
    sizeSelect.addEventListener('change', handleSizeChange);
    downloadBtn.addEventListener('click', handleDownload);
    scaleSlider.addEventListener('input', handleScaleChange);
    colorDetailSlider.addEventListener('input', processImage);
    panModeBtn.addEventListener('click', togglePanMode);
    generateBgBtn.addEventListener('click', handleGenerateBackground);
    strokeSelectionBtn.addEventListener('click', handleStrokeSelection);

    // Brush tool listeners
    brushToolSelect.addEventListener('change', handleToolChange);
    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);

    // Canvas Listeners for Drawing and Panning
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    const resizeObserver = new ResizeObserver(() => {
        if (resizeAnimationFrameId) {
            window.cancelAnimationFrame(resizeAnimationFrameId);
        }
        resizeAnimationFrameId = window.requestAnimationFrame(renderCanvas);
    });
    resizeObserver.observe(canvasWrapper);

    cacheLabPalette();
    updateGridSize();
    updateColorPalette();
    updateUndoRedoButtons();
    handleToolChange(); // Set initial tool state
    renderCanvas();
}

/**
 * Main render function. Calculates dimensions and draws the grid.
 */
function renderCanvas() {
    if (!ctx || !canvasWrapper) return;

    const wrapperWidth = canvasWrapper.clientWidth;
    const wrapperHeight = canvasWrapper.clientHeight;

    const spacingX = wrapperWidth / gridWidth;
    const spacingY = wrapperHeight / gridHeight;
    const spacing = Math.min(spacingX, spacingY);

    const newCanvasWidth = gridWidth * spacing;
    const newCanvasHeight = gridHeight * spacing;

    if (canvas.width !== newCanvasWidth) canvas.width = newCanvasWidth;
    if (canvas.height !== newCanvasHeight) canvas.height = newCanvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dotRadius = spacing * 0.4;

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            let color = pixelData[y]?.[x] || '#ffffff'; // Default to white for empty grid
            // If there's a temporary background, show it over the mask
            if (color === MASK_COLOR && generatedBackgroundData) {
                color = generatedBackgroundData[y][x];
            }
            drawDot(ctx, x, y, color, dotRadius, spacing);
        }
    }
    renderCanvasPreview();
}

/**
 * Renders a small preview of the entire canvas.
 */
function renderCanvasPreview() {
    if (!ctxPreview || !canvasPreview) return;

    // Use the CSS dimensions of the preview canvas as the target viewport
    const previewDisplayWidth = 160;
    const previewDisplayHeight = 100;

    // Calculate spacing to fit the grid within the viewport while maintaining aspect ratio
    const spacingX = previewDisplayWidth / gridWidth;
    const spacingY = previewDisplayHeight / gridHeight;
    const spacing = Math.min(spacingX, spacingY);

    // Set the canvas buffer size based on the calculated spacing.
    // This gives us a higher resolution buffer for smooth circles.
    const newCanvasWidth = gridWidth * spacing;
    const newCanvasHeight = gridHeight * spacing;

    if (canvasPreview.width !== newCanvasWidth) canvasPreview.width = newCanvasWidth;
    if (canvasPreview.height !== newCanvasHeight) canvasPreview.height = newCanvasHeight;

    ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);

    const dotRadius = spacing * 0.4;

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            let color = pixelData[y]?.[x] || '#ffffff'; // Default to white for empty grid

            // If there's a temporary background, show it over the mask
            if (color === MASK_COLOR && generatedBackgroundData) {
                color = generatedBackgroundData[y][x];
            }

            // Draw the dot using the shared function
            drawDot(ctxPreview, x, y, color, dotRadius, spacing);
        }
    }
}


/**
 * Draws a single dot on a given canvas context.
 */
function drawDot(
    context: CanvasRenderingContext2D,
    x: number, y: number,
    color: string,
    radius: number,
    spacing: number
) {
    const centerX = x * spacing + spacing / 2;
    const centerY = y * spacing + spacing / 2;
    
    let finalColor = color;
    if (color === MASK_COLOR) {
        finalColor = MASK_DISPLAY_COLOR;
    } else if (color === LIMITED_PALETTE[0]) {
        finalColor = CANVAS_DOT_COLOR_FOR_BLACK;
    }

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = finalColor;
    context.fill();
}


// --- EVENT HANDLERS ---

function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                sourceImageEl.src = originalImage!.src;
                originalImagePreview.classList.remove('hidden');
                fileNameSpan.textContent = file.name;
                resetTransforms();
                updateTransformControlsState(true);
                processImage();
            };
            originalImage.onerror = () => {
                console.error("Error loading image.");
                fileNameSpan.textContent = "Error loading file.";
            }
            originalImage.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
}

function handleSizeChange() {
    updateGridSize();
    pixelData = [];
    generatedBackgroundData = null; // Clear temp background
    originalImage = null;
    originalImagePreview.classList.add('hidden');
    fileNameSpan.textContent = 'No file chosen...';
    uploadInput.value = ''; // Reset file input
    resetTransforms();
    updateTransformControlsState(false);
    resetHistory();
    renderCanvas();
}

function handleMouseDown(event: MouseEvent) {
    if (isPanMode) {
        handlePanStart(event);
        return;
    }
    isDrawing = true;
    
    // The start of a drawing action implicitly "accepts" the generated background.
    // So, we save the state *before* the commit, so that one "undo" can revert both
    // the commit and the drawing action that triggered it.
    saveState();
    commitGeneratedBackground();

    if (pixelData.length === 0) {
        pixelData = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'));
    }
    applyToolAt(event);
}

function handleMouseMove(event: MouseEvent) {
    if (isPanMode) {
        handlePanMove(event);
        return;
    }
    if (!isDrawing) return;

    const tool = brushToolSelect.value;
    if (tool === 'pencil' || tool === 'square' || tool === 'circle') {
        applyToolAt(event);
    }
}

function handleMouseUp() {
    if (isPanMode && isDragging) {
        handlePanEnd();
    }
    isDrawing = false;
}

function applyToolAt(event: MouseEvent) {
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const spacing = canvas.clientWidth / gridWidth;
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    const x = Math.floor(canvasX / spacing);
    const y = Math.floor(canvasY / spacing);

    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;

    const tool = brushToolSelect.value;

    switch (tool) {
        case 'pencil':
            drawPencil(x, y);
            break;
        case 'square':
            drawSquare(x, y);
            break;
        case 'circle':
            drawCircle(x, y);
            break;
        case 'bucket-area':
            floodFill(x, y);
            break;
        case 'bucket-global':
            globalFill(x, y);
            break;
    }

    renderCanvas();
}

// --- BACKGROUND GENERATION ---

/** Fills the grid with a horizontal rainbow gradient. */
function generateHorizontalRainbow(grid: string[][]) {
    for (let x = 0; x < gridWidth; x++) {
        const colorIndex = Math.floor((x / gridWidth) * RAINBOW_PALETTE.length);
        const color = RAINBOW_PALETTE[colorIndex];
        for (let y = 0; y < gridHeight; y++) {
            grid[y][x] = color;
        }
    }
}

/** Fills the grid with a vertical rainbow gradient. */
function generateVerticalRainbow(grid: string[][]) {
    for (let y = 0; y < gridHeight; y++) {
        const colorIndex = Math.floor((y / gridHeight) * RAINBOW_PALETTE.length);
        const color = RAINBOW_PALETTE[colorIndex];
        for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = color;
        }
    }
}

/** Fills the grid with random horizontal bands of color. */
function generateHorizontalBands(grid: string[][]) {
    const numBands = Math.floor(Math.random() * 5) + 2;
    let y = 0;
    while (y < gridHeight) {
        const bandHeight = Math.floor(Math.random() * (gridHeight / numBands)) + 1;
        const color = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
        for (let i = y; i < y + bandHeight && i < gridHeight; i++) {
            for (let x = 0; x < gridWidth; x++) {
                grid[i][x] = color;
            }
        }
        y += bandHeight;
    }
}

/** Fills the grid with random vertical bands of color. */
function generateVerticalBands(grid: string[][]) {
    const numBands = Math.floor(Math.random() * 5) + 2;
    let x = 0;
    while (x < gridWidth) {
        const bandWidth = Math.floor(Math.random() * (gridWidth / numBands)) + 1;
        const color = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
        for (let i = x; i < x + bandWidth && i < gridWidth; i++) {
            for (let y = 0; y < gridHeight; y++) {
                grid[y][i] = color;
            }
        }
        x += bandWidth;
    }
}

/** Fills the grid with a checkerboard pattern. */
function generateCheckerboard(grid: string[][]) {
    const color1 = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
    let color2 = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
    while (color2 === color1) {
        color2 = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
    }
    const tileSize = Math.floor(Math.random() * 4) + 1;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const tileX = Math.floor(x / tileSize);
            const tileY = Math.floor(y / tileSize);
            grid[y][x] = (tileX + tileY) % 2 === 0 ? color1 : color2;
        }
    }
}

/** Fills the grid with a border and a fill color. */
function generateBorder(grid: string[][]) {
    const borderColor = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
    let fillColor = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
    while (fillColor === borderColor) {
        fillColor = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
    }
    const thickness = Math.floor(Math.random() * 3) + 1;

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (x < thickness || x >= gridWidth - thickness || y < thickness || y >= gridHeight - thickness) {
                grid[y][x] = borderColor;
            } else {
                grid[y][x] = fillColor;
            }
        }
    }
}

/** Fills the grid with random rectangles (the original method). */
function generateRandomRects(grid: string[][]) {
     let baseColor = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
     if (baseColor === '#ffffff') {
          baseColor = LIMITED_PALETTE[0]; // Black
     }
     for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = baseColor;
        }
    }
    const numShapes = Math.floor(Math.random() * (gridWidth / 2)) + (gridWidth / 4);
    for (let i = 0; i < numShapes; i++) {
        const shapeColor = LIMITED_PALETTE[Math.floor(Math.random() * LIMITED_PALETTE.length)];
        if(shapeColor === baseColor) continue;
        const startX = Math.floor(Math.random() * gridWidth);
        const startY = Math.floor(Math.random() * gridHeight);
        const shapeWidth = Math.floor(Math.random() * (gridWidth / 3)) + 2;
        const shapeHeight = Math.floor(Math.random() * (gridHeight / 3)) + 2;
        for (let y = startY; y < startY + shapeHeight && y < gridHeight; y++) {
            for (let x = startX; x < startX + shapeWidth && x < gridWidth; x++) {
                grid[y][x] = shapeColor;
            }
        }
    }
}


function handleGenerateBackground() {
    const originalBtnText = generateBgBtn.textContent;
    generateBgBtn.disabled = true;
    generateBgBtn.textContent = 'Generating...';

    const generators = [
        generateHorizontalRainbow,
        generateVerticalRainbow,
        generateHorizontalBands,
        generateVerticalBands,
        generateCheckerboard,
        generateBorder,
        generateRandomRects
    ];

    try {
        setTimeout(() => {
            let hasMask = false;
            if (pixelData && pixelData.length > 0) {
                 for (let y = 0; y < gridHeight; y++) {
                    for (let x = 0; x < gridWidth; x++) {
                        if (pixelData[y]?.[x] === MASK_COLOR) {
                            hasMask = true;
                            break;
                        }
                    }
                    if(hasMask) break;
                }
            }

            const newPattern: string[][] = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'));
            const generator = generators[Math.floor(Math.random() * generators.length)];
            generator(newPattern);

            if (hasMask) {
                // With a mask, we don't modify pixelData. We just set the temporary overlay.
                // This allows generating again without losing the mask.
                generatedBackgroundData = newPattern;
            } else {
                // No mask, this is a destructive action. Save the previous state.
                // Discard any uncommitted generated background as we are about to overwrite everything.
                generatedBackgroundData = null;
                saveState();
                pixelData = newPattern;
            }

            renderCanvas();

            generateBgBtn.disabled = false;
            generateBgBtn.textContent = originalBtnText;
        }, 50); // Small delay for UX
    } catch (error) {
        console.error("Error generating background:", error);
        alert(`Sorry, there was an error generating the background. Please try again.`);
        generateBgBtn.disabled = false;
        generateBgBtn.textContent = originalBtnText;
    }
}

function handleStrokeSelection() {
    // A drawing action implicitly "accepts" the generated background.
    commitGeneratedBackground();

    let hasMask = false;
    if (pixelData && pixelData.length > 0) {
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (pixelData[y]?.[x] === MASK_COLOR) {
                    hasMask = true;
                    break;
                }
            }
            if (hasMask) break;
        }
    }

    if (!hasMask) {
        alert("Please create a mask selection first to use the stroke tool.");
        return;
    }

    if (selectedColor === MASK_COLOR) {
        alert("Please select a color for the stroke, not the mask tool itself.");
        return;
    }

    saveState();

    const borderPixels: { x: number; y: number }[] = [];
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (pixelData[y][x] === MASK_COLOR) {
                const neighbors = [
                    [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]
                ];

                let isBorder = false;
                for (const [nx, ny] of neighbors) {
                    // A pixel is on the border if its neighbor is outside the canvas
                    // or if the neighbor is not also a mask pixel.
                    if (nx < 0 || nx >= gridWidth || ny < 0 || ny >= gridHeight || (pixelData[ny]?.[nx] !== MASK_COLOR)) {
                        isBorder = true;
                        break;
                    }
                }

                if (isBorder) {
                    borderPixels.push({ x, y });
                }
            }
        }
    }

    if (borderPixels.length === 0) {
        return;
    }
    
    // Apply the stroke
    for (const { x, y } of borderPixels) {
        pixelData[y][x] = selectedColor;
    }

    renderCanvas();
}


function handleDownload() {
    // Commit any temporary background before downloading to get the final image.
    commitGeneratedBackground();

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    const pixelSize = 25;
    const radius = pixelSize * 0.3; // Increased margin for exported image

    tempCanvas.width = gridWidth * pixelSize;
    tempCanvas.height = gridHeight * pixelSize;

    tempCtx.fillStyle = '#000000';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const dataToRender = pixelData.length > 0
        ? pixelData
        : Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'));


    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const color = dataToRender[y]?.[x];
            // Skip rendering for mask color to make it transparent
            if (color && color !== MASK_COLOR) {
                tempCtx.beginPath();
                tempCtx.arc(x * pixelSize + (pixelSize / 2), y * pixelSize + (pixelSize / 2), radius, 0, 2 * Math.PI, false);
                tempCtx.fillStyle = color; // Use original black for download
                tempCtx.fill();
            }
        }
    }

    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = dataUrl;
    link.click();
}

function handleScaleChange(event: Event) {
    if (!originalImage) return;
    scale = parseFloat((event.target as HTMLInputElement).value);
    processImage();
}

function handleToolChange() {
    const selectedTool = brushToolSelect.value;
    brushSizeInput.disabled = selectedTool === 'pencil';
}

function togglePanMode() {
    if (!originalImage) return;
    isPanMode = !isPanMode;
    panModeBtn.classList.toggle('active', isPanMode);
    canvas.style.cursor = isPanMode ? 'grab' : 'default';
}

function handlePanStart(event: MouseEvent) {
    if (!isPanMode || !originalImage) return;
    isDragging = true;
    dragStart = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = 'grabbing';
}

function handlePanMove(event: MouseEvent) {
    if (!isDragging || !isPanMode) return;
    
    // Panning is now relative to the canvas size, not grid spacing
    const dx = (event.clientX - dragStart.x);
    const dy = (event.clientY - dragStart.y);

    panOffset.x += dx;
    panOffset.y += dy;

    dragStart = { x: event.clientX, y: event.clientY };
    processImage();
}

function handlePanEnd() {
    if (!isPanMode || !isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
}

function handleUndo() {
    if (historyStack.length === 0) return;
    generatedBackgroundData = null; // Clear temp background when undoing
    redoStack.push(pixelData.map(row => [...row]));
    const previousState = historyStack.pop()!;
    pixelData = previousState.map(row => [...row]);
    renderCanvas();
    updateUndoRedoButtons();
}

function handleRedo() {
    if (redoStack.length === 0) return;
    generatedBackgroundData = null; // Clear temp background when redoing
    historyStack.push(pixelData.map(row => [...row]));
    if (historyStack.length > MAX_HISTORY_SIZE) {
        historyStack.shift();
    }
    const nextState = redoStack.pop()!;
    pixelData = nextState.map(row => [...row]);
    renderCanvas();
    updateUndoRedoButtons();
}


// --- TOOL IMPLEMENTATIONS ---

function drawPencil(x: number, y: number) {
    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
        pixelData[y][x] = selectedColor;
    }
}

function drawSquare(x: number, y: number) {
    const brushSize = parseInt(brushSizeInput.value, 10) || 1;
    const startX = x - Math.floor(brushSize / 2);
    const startY = y - Math.floor(brushSize / 2);
    const endX = startX + brushSize;
    const endY = startY + brushSize;

    for (let i = startY; i < endY; i++) {
        for (let j = startX; j < endX; j++) {
            if (j >= 0 && j < gridWidth && i >= 0 && i < gridHeight) {
                pixelData[i][j] = selectedColor;
            }
        }
    }
}

function drawCircle(centerX: number, centerY: number) {
    const brushSize = parseInt(brushSizeInput.value, 10) || 1;

    // Use pre-calculated patterns for small, common sizes for better aesthetics
    if (brushSize in SMALL_CIRCLE_PATTERNS) {
        const pattern = SMALL_CIRCLE_PATTERNS[brushSize as keyof typeof SMALL_CIRCLE_PATTERNS];
        const offset = Math.floor(brushSize / 2);
        for (const p of pattern) {
            const x = centerX + p[0] - offset;
            const y = centerY + p[1] - offset;
            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                pixelData[y][x] = selectedColor;
            }
        }
        return;
    }

    // For larger sizes, use a mathematical formula
    const radius = brushSize / 2;
    const startY = Math.floor(centerY - radius);
    const endY = Math.ceil(centerY + radius);
    const startX = Math.floor(centerX - radius);
    const endX = Math.ceil(centerX + radius);

    for (let i = startY; i < endY; i++) {
        for (let j = startX; j < endX; j++) {
            if (j >= 0 && j < gridWidth && i >= 0 && i < gridHeight) {
                const dx = j - centerX;
                const dy = i - centerY;
                // Check if the center of the pixel is within the circle
                if (Math.sqrt(dx * dx + dy * dy) < radius) {
                    pixelData[i][j] = selectedColor;
                }
            }
        }
    }
}


function globalFill(x: number, y: number) {
    if (pixelData[y]?.[x] === undefined) return;
    const targetColor = pixelData[y][x];
    if (targetColor !== selectedColor) {
        pixelData = pixelData.map(row =>
            row.map(cellColor =>
                cellColor === targetColor ? selectedColor : cellColor
            )
        );
    }
}

function floodFill(startX: number, startY: number) {
    const targetColor = pixelData[startY]?.[startX];
    if (targetColor === undefined || targetColor === selectedColor) {
        return;
    }

    const q: [number, number][] = [[startX, startY]];
    pixelData[startY][startX] = selectedColor;

    let head = 0;
    while(head < q.length){
        const [x, y] = q[head++];
        const neighbors: [number, number][] = [
            [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
        ];
        for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight && pixelData[ny][nx] === targetColor) {
                pixelData[ny][nx] = selectedColor;
                q.push([nx, ny]);
            }
        }
    }
}

// --- HELPER FUNCTIONS ---

/**
 * Merges the temporary generated background into the main pixelData grid.
 * This makes the previewed background permanent.
 * @returns {boolean} - True if a commit happened, false otherwise.
 */
function commitGeneratedBackground(): boolean {
    if (!generatedBackgroundData) {
        return false;
    }

    const newData = pixelData.map(row => [...row]);
    let modified = false;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (newData[y]?.[x] === MASK_COLOR) {
                newData[y][x] = generatedBackgroundData[y][x];
                modified = true;
            }
        }
    }

    if (modified) {
        pixelData = newData;
    }
    generatedBackgroundData = null;
    return modified;
}

function updateGridSize() {
    const [width, height] = sizeSelect.value.split('x').map(Number);
    gridWidth = width;
    gridHeight = height;
}

function processImage() {
    if (!originalImage) {
        pixelData = [];
        renderCanvas();
        return;
    }

    // Discard any temporary background when loading a new image
    generatedBackgroundData = null;
    resetHistory();

    // Create a temporary canvas to resample the image to the grid dimensions.
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gridWidth;
    tempCanvas.height = gridHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;

    // Set a white background to handle transparent images gracefully.
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, gridWidth, gridHeight);

    // Calculate aspect-ratio correct dimensions for drawing image onto temp canvas
    const imgAspectRatio = originalImage.width / originalImage.height;
    const gridAspectRatio = gridWidth / gridHeight;
    
    let dWidth, dHeight, dx, dy; // Destination rect on tempCanvas
    if (imgAspectRatio > gridAspectRatio) {
        dWidth = gridWidth;
        dHeight = gridWidth / imgAspectRatio;
        dx = 0;
        dy = (gridHeight - dHeight) / 2;
    } else {
        dHeight = gridHeight;
        dWidth = gridHeight * imgAspectRatio;
        dy = 0;
        dx = (gridWidth - dWidth) / 2;
    }

    // Apply scale and pan to the destination rectangle
    const finalDrawWidth = dWidth * scale;
    const finalDrawHeight = dHeight * scale;
    const finalDrawX = dx - (finalDrawWidth - dWidth) / 2 + panOffset.x;
    const finalDrawY = dy - (finalDrawHeight - dHeight) / 2 + panOffset.y;

    tempCtx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height, finalDrawX, finalDrawY, finalDrawWidth, finalDrawHeight);

    const imageData = tempCtx.getImageData(0, 0, gridWidth, gridHeight);
    const data = imageData.data;
    const newPixelData: string[][] = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(''));

    // --- Posterization ---
    const colorLevels = parseInt(colorDetailSlider.value, 10);
    const factor = 255 / (colorLevels - 1);

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const i = (y * gridWidth + x) * 4;
            if (data[i + 3] < 128) { // Handle transparency
                newPixelData[y][x] = '#ffffff';
            } else {
                // Apply posterization to simplify colors
                const r = Math.round(data[i] / factor) * factor;
                const g = Math.round(data[i+1] / factor) * factor;
                const b = Math.round(data[i+2] / factor) * factor;
                
                newPixelData[y][x] = findClosestColor(r, g, b);
            }
        }
    }
    
    pixelData = newPixelData;
    renderCanvas();
}


function updateColorPalette() {
    colorPaletteContainer.innerHTML = '';
    
    const selectColor = (color: string, swatchElement: HTMLElement) => {
        selectedColor = color;
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        swatchElement.classList.add('selected');
    };

    LIMITED_PALETTE.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color === LIMITED_PALETTE[0] ? CANVAS_DOT_COLOR_FOR_BLACK : color;
        swatch.dataset.color = color;
        if (color === selectedColor) {
            swatch.classList.add('selected');
        }
        swatch.addEventListener('click', () => selectColor(color, swatch));
        colorPaletteContainer.appendChild(swatch);
    });

    // Add Mask Swatch
    const maskSwatch = document.createElement('div');
    maskSwatch.className = 'color-swatch mask-swatch';
    maskSwatch.dataset.color = MASK_COLOR;
    maskSwatch.title = 'Masking Area (for background generation)';
    if (MASK_COLOR === selectedColor) {
        maskSwatch.classList.add('selected');
    }
    maskSwatch.addEventListener('click', () => selectColor(MASK_COLOR, maskSwatch));
    colorPaletteContainer.appendChild(maskSwatch);
}

function updateTransformControlsState(enabled: boolean) {
    scaleSlider.disabled = !enabled;
    panModeBtn.disabled = !enabled;
    colorDetailSlider.disabled = !enabled;
}

function resetTransforms() {
    scale = 1.0;
    scaleSlider.value = '1';
    panOffset = { x: 0, y: 0 };
    if (isPanMode) {
        isPanMode = false;
        panModeBtn.classList.remove('active');
        canvas.style.cursor = 'default';
    }
}

function saveState() {
    historyStack.push(pixelData.map(row => [...row]));
    if (historyStack.length > MAX_HISTORY_SIZE) {
        historyStack.shift();
    }
    if (redoStack.length > 0) {
        redoStack = [];
    }
    updateUndoRedoButtons();
}

function resetHistory() {
    historyStack = [];
    redoStack = [];
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    undoBtn.disabled = historyStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
}


// --- COLOR CONVERSION AND MATCHING ---

function cacheLabPalette() {
    labPaletteCache = LIMITED_PALETTE.map(hex => {
        const rgb = hexToRgb(hex)!;
        return { hex: hex, lab: rgbToLab(rgb.r, rgb.g, rgb.b) };
    });
}

function findClosestColor(r: number, g: number, b: number): string {
    const inputLab = rgbToLab(r, g, b);
    let closestColor = labPaletteCache[0].hex;
    let minDistance = Infinity;

    for (const paletteColor of labPaletteCache) {
        const distance = Math.sqrt(
            Math.pow(inputLab.l - paletteColor.lab.l, 2) +
            Math.pow(inputLab.a - paletteColor.lab.a, 2) +
            Math.pow(inputLab.b - paletteColor.lab.b, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = paletteColor.hex;
        }
    }
    return closestColor;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : null;
}

function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
    let R = r / 255, G = g / 255, B = b / 255;

    R = (R > 0.04045) ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
    G = (G > 0.04045) ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
    B = (B > 0.04045) ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

    R *= 100; G *= 100; B *= 100;

    const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
    const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    let var_X = X / 95.047;
    let var_Y = Y / 100.000;
    let var_Z = Z / 108.883;

    var_X = (var_X > 0.008856) ? Math.pow(var_X, 1/3) : (7.787 * var_X) + (16 / 116);
    var_Y = (var_Y > 0.008856) ? Math.pow(var_Y, 1/3) : (7.787 * var_Y) + (16 / 116);
    var_Z = (var_Z > 0.008856) ? Math.pow(var_Z, 1/3) : (7.787 * var_Z) + (16 / 116);

    const cieL = (116 * var_Y) - 16;
    const cieA = 500 * (var_X - var_Y);
    const cieB = 200 * (var_Y - var_Z);

    return { l: cieL, a: cieA, b: cieB };
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', init);