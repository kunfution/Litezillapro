

// --- TYPE DEFINITIONS for File System Access API ---
// These interfaces are added to provide type safety for a modern browser API
// without causing errors in environments that don't have up-to-date TS DOM libs.
interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: Blob | string | BufferSource): Promise<void>;
    close(): Promise<void>;
}

interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: {
        description: string;
        accept: Record<string, string[]>;
    }[];
}

// Augment the global Window interface
interface Window {
    showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
}


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

// Redesigned 3x5 pixel font for better legibility + lowercase
const PIXEL_FONT: { [key: string]: number[][] } = {
    'A': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
    'C': [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
    'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
    'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
    'F': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
    'G': [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
    'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
    'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
    'J': [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
    'K': [[1,0,1],[1,1,0],[1,1,0],[1,0,1],[1,0,1]],
    'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
    'M': [[1,0,1],[1,1,1],[1,0,1],[1,0,1],[1,0,1]],
    'N': [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
    'O': [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
    'P': [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
    'Q': [[0,1,0],[1,0,1],[1,0,1],[0,1,1],[0,0,1]],
    'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
    'S': [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
    'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
    'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,1]],
    'V': [[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
    'W': [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
    'X': [[1,0,1],[0,1,0],[0,1,0],[0,1,0],[1,0,1]],
    'Y': [[1,0,1],[1,0,1],[0,1,1],[0,1,0],[0,1,0]],
    'Z': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
    'a': [[0,0,0],[0,1,0],[1,1,1],[1,0,1],[0,1,1]],
    'b': [[1,0,0],[1,0,0],[1,1,0],[1,0,1],[1,1,0]],
    'c': [[0,0,0],[0,1,1],[1,0,0],[1,0,0],[0,1,1]],
    'd': [[0,0,1],[0,0,1],[0,1,1],[1,0,1],[0,1,1]],
    'e': [[0,0,0],[0,1,0],[1,1,1],[1,0,0],[0,1,1]],
    'f': [[0,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
    'g': [[0,1,1],[1,0,1],[0,1,1],[0,0,1],[0,1,0]],
    'h': [[1,0,0],[1,0,0],[1,1,0],[1,0,1],[1,0,1]],
    'i': [[0,1,0],[0,0,0],[0,1,0],[0,1,0],[0,1,0]],
    'j': [[0,0,1],[0,0,0],[0,1,1],[0,1,1],[1,1,0]],
    'k': [[1,0,0],[1,0,1],[1,1,0],[1,1,0],[1,0,1]],
    'l': [[1,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,1]],
    'm': [[0,0,0],[1,1,1],[1,0,1],[1,0,1],[1,0,1]],
    'n': [[0,0,0],[1,1,0],[1,0,1],[1,0,1],[1,0,1]],
    'o': [[0,0,0],[0,1,0],[1,0,1],[1,0,1],[0,1,0]],
    'p': [[0,0,0],[1,1,0],[1,0,1],[1,1,0],[1,0,0]],
    'q': [[0,0,0],[0,1,1],[1,0,1],[0,1,1],[0,0,1]],
    'r': [[0,0,0],[1,1,0],[1,0,1],[1,0,0],[1,0,0]],
    's': [[0,0,0],[0,1,1],[1,0,0],[0,0,1],[1,1,0]],
    't': [[1,0,0],[1,1,1],[1,0,0],[1,0,1],[0,1,0]],
    'u': [[0,0,0],[1,0,1],[1,0,1],[1,0,1],[0,1,1]],
    'v': [[0,0,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
    'w': [[0,0,0],[1,0,1],[1,0,1],[1,1,1],[1,1,1]],
    'x': [[0,0,0],[1,0,1],[0,1,0],[1,0,1],[0,0,0]],
    'y': [[1,0,1],[1,0,1],[0,1,1],[0,0,1],[0,1,0]],
    'z': [[0,0,0],[1,1,1],[0,1,0],[1,0,0],[1,1,1]],
    '0': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[0,1,0]],
    '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
    '2': [[1,1,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
    '3': [[1,1,0],[0,0,1],[0,1,0],[0,0,1],[1,1,0]],
    '4': [[0,0,1],[0,1,1],[1,0,1],[1,1,1],[0,0,1]],
    '5': [[1,1,1],[1,0,0],[1,1,0],[0,0,1],[1,1,0]],
    '6': [[0,1,1],[1,0,0],[1,1,0],[1,0,1],[0,1,0]],
    '7': [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
    '8': [[0,1,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]],
    '9': [[0,1,0],[1,0,1],[0,1,1],[0,0,1],[1,1,0]],
    '!': [[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
    '?': [[1,1,0],[0,1,1],[0,1,0],[0,0,0],[0,1,0]],
    '.': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
    ',': [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[1,0,0]],
    ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
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
const downloadSvgBtn = document.getElementById('download-svg-btn') as HTMLButtonElement;
const saveProjectBtn = document.getElementById('save-project-btn') as HTMLButtonElement;
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
const lightEffectBtn = document.getElementById('light-effect-btn') as HTMLButtonElement;
const textInput = document.getElementById('text-input') as HTMLInputElement;
const textSizeInput = document.getElementById('text-size-input') as HTMLInputElement;
const placeTextBtn = document.getElementById('place-text-btn') as HTMLButtonElement;
const hotkeyHelpBtn = document.getElementById('hotkey-help-btn') as HTMLButtonElement;
const hotkeyPopover = document.getElementById('hotkey-popover') as HTMLDivElement;


// --- APP STATE ---
let originalImage: HTMLImageElement | null = null;
let gridWidth = 51; // Viewport width
let gridHeight = 26; // Viewport height
let pixelData = new Map<string, string>(); // Use a Map for a sparse, infinite grid. Key: "x,y", Value: hex color
let artboardOffset = { x: 0, y: 0 }; // Viewport's top-left corner on the infinite artboard.
let generatedBackgroundData: string[][] | null = null; // Temp layer for masked generation
let historyStack: { pixelData: Map<string, string>; artboardOffset: { x: number; y: number } }[] = [];
let redoStack: { pixelData: Map<string, string>; artboardOffset: { x: number; y: number } }[] = [];
const MAX_HISTORY_SIZE = 50;
let selectedColor: string = LIMITED_PALETTE[1]; // Default to white
let resizeAnimationFrameId: number | null = null;
let labPaletteCache: { hex: string, lab: { l: number, a: number, b: number } }[] = [];


// Transform and Drawing State
let scale = 1.0;
let panOffset = { x: 0, y: 0 }; // Used for panning gesture preview in pixels
let isPanMode = false;
let isGlowEnabled = false;
let isDragging = false; // For panning
let isDrawing = false; // For drawing tools
let dragStart = { x: 0, y: 0 }; // For panning gesture origin
let isTextPlacementMode = false;

// --- CORE FUNCTIONS ---

function init() {
    fileBtn.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', handleImageUpload);
    sizeSelect.addEventListener('change', handleSizeChange);
    downloadBtn.addEventListener('click', handleDownload);
    downloadSvgBtn.addEventListener('click', handleDownloadSVG);
    saveProjectBtn.addEventListener('click', handleSaveProject);
    scaleSlider.addEventListener('input', handleScaleChange);
    colorDetailSlider.addEventListener('input', processImage);
    panModeBtn.addEventListener('click', togglePanMode);
    generateBgBtn.addEventListener('click', handleGenerateBackground);
    strokeSelectionBtn.addEventListener('click', handleStrokeSelection);
    lightEffectBtn.addEventListener('click', toggleLightEffect);
    placeTextBtn.addEventListener('click', toggleTextPlacementMode);

    // Brush tool listeners
    brushToolSelect.addEventListener('change', handleToolChange);
    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);

    // Canvas Listeners for Drawing and Panning
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // Hotkey Popover Listeners
    hotkeyHelpBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent this click from being caught by the document listener
        hotkeyPopover.classList.toggle('hidden');
        hotkeyHelpBtn.classList.toggle('active', !hotkeyPopover.classList.contains('hidden'));
    });

    document.addEventListener('click', (e) => {
        // Hide popover if click is outside of it and not on the help button itself
        if (!hotkeyPopover.classList.contains('hidden')) {
            const target = e.target as Node;
            if (!hotkeyPopover.contains(target) && !hotkeyHelpBtn.contains(target)) {
                 hotkeyPopover.classList.add('hidden');
                 hotkeyHelpBtn.classList.remove('active');
            }
        }
    });
    document.addEventListener('keydown', handleHotkeys);


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
 * Calculates the uniform spacing for grid cells to fit within the wrapper.
 */
function getSpacing(): number {
    if (!canvasWrapper) return 1;
    const wrapperWidth = canvasWrapper.clientWidth;
    const wrapperHeight = canvasWrapper.clientHeight;
    const spacingX = wrapperWidth / gridWidth;
    const spacingY = wrapperHeight / gridHeight;
    return Math.min(spacingX, spacingY);
}


/**
 * Converts screen coordinates to absolute artboard grid coordinates.
 */
function screenToGrid(event: MouseEvent): {x: number, y: number} | null {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const spacing = getSpacing();
    
    // Mouse coordinates relative to the canvas element's top-left corner
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // The grid cell on the visible canvas
    const viewGridX = Math.floor(canvasX / spacing);
    const viewGridY = Math.floor(canvasY / spacing);

    // Check if the coordinates are within the grid bounds
    if (viewGridX < 0 || viewGridX >= gridWidth || viewGridY < 0 || viewGridY >= gridHeight) {
        return null;
    }
    
    // Return the absolute coordinate on the infinite artboard
    return { x: viewGridX + artboardOffset.x, y: viewGridY + artboardOffset.y };
}


/**
 * Main render function. Renders the current viewport of the artboard.
 */
function renderCanvas() {
    if (!ctx || !canvasWrapper) return;
    if(resizeAnimationFrameId) resizeAnimationFrameId = null;

    const spacing = getSpacing();
    
    const artboardWidth = gridWidth * spacing;
    const artboardHeight = gridHeight * spacing;
    
    if (canvas.width !== artboardWidth) canvas.width = artboardWidth;
    if (canvas.height !== artboardHeight) canvas.height = artboardHeight;
    canvas.style.width = `${artboardWidth}px`;
    canvas.style.height = `${artboardHeight}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dotRadius = spacing * 0.35;

    // Pan preview offset in grid cells
    const panPreviewX = isDragging && isPanMode ? Math.round(panOffset.x / spacing) : 0;
    const panPreviewY = isDragging && isPanMode ? Math.round(panOffset.y / spacing) : 0;

    for (let y = 0; y < gridHeight; y++) { // y is the viewport row
        for (let x = 0; x < gridWidth; x++) { // x is the viewport col
            
            // Find the source pixel on the infinite artboard
            const sourceX = x + artboardOffset.x - panPreviewX;
            const sourceY = y + artboardOffset.y - panPreviewY;

            let color = getPixel(sourceX, sourceY);

            // If there's a temporary background, show it over the mask
            if (color === MASK_COLOR && generatedBackgroundData) {
                 color = generatedBackgroundData[y]?.[x] || MASK_COLOR;
            }

            drawDot(ctx, x, y, color, dotRadius, spacing);
        }
    }
    
    renderCanvasPreview();
    updateColorCounts();
}

/**
 * Renders a small preview of the current viewport.
 */
function renderCanvasPreview() {
    if (!ctxPreview || !canvasPreview) { return; };

    // The art to be previewed is exactly what's in the viewport.
    const artWidth = gridWidth;
    const artHeight = gridHeight;

    // Calculate spacing to fit viewport in preview area
    const previewDisplayWidth = 160;
    const previewDisplayHeight = 100;
    const spacingX = previewDisplayWidth / artWidth;
    const spacingY = previewDisplayHeight / artHeight;
    const spacing = Math.min(spacingX, spacingY);

    const newCanvasWidth = artWidth * spacing;
    const newCanvasHeight = artHeight * spacing;
    if (canvasPreview.width !== newCanvasWidth) canvasPreview.width = newCanvasWidth;
    if (canvasPreview.height !== newCanvasHeight) canvasPreview.height = newCanvasHeight;
    ctxPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);
    const dotRadius = spacing * 0.35;

    // Draw the art by iterating through the viewport dimensions
    for (let y = 0; y < artHeight; y++) {
        for (let x = 0; x < artWidth; x++) {
            // Get the pixel from the main artboard corresponding to the viewport cell
            const artX = x + artboardOffset.x;
            const artY = y + artboardOffset.y;
            let color = getPixel(artX, artY);
            
            // If there's a temporary background, show it in the preview.
            if (color === MASK_COLOR && generatedBackgroundData) {
                // `generatedBackgroundData` is viewport-relative (y, x).
                color = generatedBackgroundData[y]?.[x] || MASK_COLOR;
            }
            
            // The drawing coordinates on the preview canvas are the loop iterators (x, y)
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

    // Apply glow effect if enabled
    if (isGlowEnabled && color !== MASK_COLOR) {
        context.shadowBlur = 8;
        context.shadowColor = finalColor;
    }

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = finalColor;
    context.fill();

    // Reset shadow effect to not affect subsequent drawings in the same frame
    if (isGlowEnabled && color !== MASK_COLOR) {
        context.shadowBlur = 0;
    }
}


// --- EVENT HANDLERS ---

function handleHotkeys(event: KeyboardEvent) {
    // Handle Esc key to close popover
    if (event.key === 'Escape') {
        if (!hotkeyPopover.classList.contains('hidden')) {
            hotkeyPopover.classList.add('hidden');
            hotkeyHelpBtn.classList.remove('active');
            event.preventDefault(); // Prevent other 'Esc' behaviors
            return;
        }
    }

    // Don't trigger hotkeys if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    // Handle shortcuts with modifiers (Ctrl, Alt)
    if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
            case 'z':
                event.preventDefault();
                undoBtn.click();
                break;
            case 'y':
                event.preventDefault();
                redoBtn.click();
                break;
            case 's':
                event.preventDefault();
                if (event.altKey) {
                    // Ctrl + Alt + S
                    handleDownload();
                } else {
                    // Ctrl + S
                    handleSaveProject();
                }
                break;
        }
        return; // Stop further processing for Ctrl-combos
    }

    // Handle single-key shortcuts
    let toolChanged = false;
    switch (event.key.toLowerCase()) {
        case 'b':
            brushToolSelect.value = 'pencil';
            toolChanged = true;
            break;
        case 'm':
            brushToolSelect.value = event.shiftKey ? 'circle' : 'square';
            toolChanged = true;
            break;
        case 'g':
            brushToolSelect.value = event.shiftKey ? 'bucket-global' : 'bucket-area';
            toolChanged = true;
            break;
        case 'h':
            panModeBtn.click();
            break;
        case 'l':
            lightEffectBtn.click();
            break;
    }
    
    if (toolChanged) {
        handleToolChange();
    }
}

function handleImageUpload(event: Event) {
    cancelTextPlacementMode();
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Route based on file extension
    if (file.name.endsWith('.pixelart')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const projectData = JSON.parse(text);

                if (!projectData.gridWidth || !projectData.gridHeight || !projectData.pixelData) {
                    throw new Error("Invalid project file format.");
                }

                // Restore state from file
                gridWidth = projectData.gridWidth;
                gridHeight = projectData.gridHeight;
                pixelData = new Map(projectData.pixelData);
                artboardOffset = projectData.artboardOffset || {x: 0, y: 0};
                
                // Update UI to match loaded state
                const sizeValue = `${gridWidth}x${gridHeight}`;
                if ([...sizeSelect.options].some(opt => opt.value === sizeValue)) {
                    sizeSelect.value = sizeValue;
                } else {
                     console.warn(`Loaded a custom grid size (${sizeValue}) that is not in the dropdown list.`);
                }

                originalImage = null;
                originalImagePreview.classList.add('hidden');
                fileNameSpan.textContent = file.name;
                generatedBackgroundData = null; // Clear any temp background
                resetTransforms();
                updateTransformControlsState(false);
                resetHistory();
                renderCanvas();
                
            } catch (error) {
                console.error("Error loading project file:", error);
                alert("Could not load project file. It may be corrupt or in the wrong format.");
                fileNameSpan.textContent = "Error loading project.";
            }
        };
        reader.onerror = () => {
            console.error("Error reading project file.");
            fileNameSpan.textContent = "Error reading project file.";
        };
        reader.readAsText(file);
    } else { // This is an image file
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                sourceImageEl.src = originalImage!.src;
                originalImagePreview.classList.remove('hidden');
                fileNameSpan.textContent = file.name;
                resetTransforms();
                updateTransformControlsState(true);
                processImage(); // This also resets history
            };
            originalImage.onerror = () => {
                console.error("Error loading image.");
                fileNameSpan.textContent = "Error loading file.";
            };
            originalImage.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
    
    // Reset file input to allow uploading the same file again
    uploadInput.value = '';
}

function handleSizeChange() {
    cancelTextPlacementMode();
    updateGridSize();
    pixelData.clear();
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
    if (event.shiftKey) { // Eyedropper tool
        handleEyedropper(event);
        return;
    }

    if (isTextPlacementMode) {
        placeTextOnCanvas(event);
        return;
    }
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

function handleEyedropper(event: MouseEvent) {
    const coords = screenToGrid(event);
    if (!coords) return;
    
    const { x, y } = coords;
    const pickedColor = getPixel(x, y);

    if (pickedColor) {
        if ([...LIMITED_PALETTE, MASK_COLOR].includes(pickedColor)) {
            selectColor(pickedColor);
        }
    }
}


function applyToolAt(event: MouseEvent) {
    const coords = screenToGrid(event);
    if (!coords) return;

    const { x, y } = coords;
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

/** Fills the canvas with a tiling of Tetris-like pieces. */
function generateTetrisPattern(grid: string[][]) {
    // 1. Define shapes and all their rotations
    const shapes = {
        'I': [
            [[1, 1, 1, 1]],
            [[1], [1], [1], [1]]
        ],
        'O': [
            [[1, 1], [1, 1]]
        ],
        'T': [
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0], [1, 1], [1, 0]],
            [[1, 1, 1], [0, 1, 0]],
            [[0, 1], [1, 1], [0, 1]]
        ],
        'J': [
            [[1, 0, 0], [1, 1, 1]],
            [[1, 1], [1, 0], [1, 0]],
            [[1, 1, 1], [0, 0, 1]],
            [[0, 1], [0, 1], [1, 1]]
        ],
        'L': [
            [[0, 0, 1], [1, 1, 1]],
            [[1, 0], [1, 0], [1, 1]],
            [[1, 1, 1], [1, 0, 0]],
            [[1, 1], [0, 1], [0, 1]]
        ],
        'S': [
            [[0, 1, 1], [1, 1, 0]],
            [[1, 0], [1, 1], [0, 1]]
        ],
        'Z': [
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1], [1, 1], [1, 0]]
        ],
    };

    const allPieceMatrices: number[][][] = Object.values(shapes).flat();
    const pieceColors = LIMITED_PALETTE.filter(c => c !== '#222222' && c !== '#ffffff');
    const fallbackColor = '#0f8d0f'; // Dark Green as a fallback instead of black/grey

    // 2. Work on a smaller grid where each cell represents a 2x2 block
    const tileGridHeight = Math.floor(gridHeight / 2);
    const tileGridWidth = Math.floor(gridWidth / 2);
    
    if (tileGridHeight === 0 || tileGridWidth === 0) {
        // Grid is too small to tile, just fill with a color
        const color = pieceColors[0] || fallbackColor;
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                grid[y][x] = color;
            }
        }
        return;
    }

    // This grid stores the color for each TILE
    const tempTileGrid: (string | null)[][] = Array.from({ length: tileGridHeight }, () => Array(tileGridWidth).fill(null));

    // 3. Main tiling loop on the tile grid
    for (let y = 0; y < tileGridHeight; y++) {
        for (let x = 0; x < tileGridWidth; x++) {
            if (tempTileGrid[y][x] !== null) continue;

            const shuffledPieces = [...allPieceMatrices].sort(() => Math.random() - 0.5);
            let pieceWasPlaced = false;

            for (const pieceMatrix of shuffledPieces) {
                const pieceHeight = pieceMatrix.length;
                const pieceWidth = pieceMatrix[0].length;

                for (let py = 0; py < pieceHeight; py++) {
                    for (let px = 0; px < pieceWidth; px++) {
                        if (pieceMatrix[py][px] === 0) continue;

                        const anchorY = y - py;
                        const anchorX = x - px;

                        if (anchorY < 0 || anchorX < 0 || anchorY + pieceHeight > tileGridHeight || anchorX + pieceWidth > tileGridWidth) {
                            continue;
                        }

                        let hasOverlap = false;
                        for (let cy = 0; cy < pieceHeight; cy++) {
                            for (let cx = 0; cx < pieceWidth; cx++) {
                                if (pieceMatrix[cy][cx] === 1 && tempTileGrid[anchorY + cy][anchorX + cx] !== null) {
                                    hasOverlap = true;
                                    break;
                                }
                            }
                            if (hasOverlap) break;
                        }

                        if (hasOverlap) continue;

                        const color = pieceColors[Math.floor(Math.random() * pieceColors.length)];
                        for (let cy = 0; cy < pieceHeight; cy++) {
                            for (let cx = 0; cx < pieceWidth; cx++) {
                                if (pieceMatrix[cy][cx] === 1) {
                                    tempTileGrid[anchorY + cy][anchorX + cx] = color;
                                }
                            }
                        }
                        
                        pieceWasPlaced = true;
                        break;
                    }
                    if (pieceWasPlaced) break;
                }
                if (pieceWasPlaced) break;
            }

            if (!pieceWasPlaced) {
                tempTileGrid[y][x] = fallbackColor;
            }
        }
    }

    // 4. Render the scaled-up tile grid onto the final output grid
    // Pre-fill with fallback color to handle odd dimensions
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            grid[y][x] = fallbackColor;
        }
    }

    for (let ty = 0; ty < tileGridHeight; ty++) {
        for (let tx = 0; tx < tileGridWidth; tx++) {
            const color = tempTileGrid[ty][tx] || fallbackColor;
            const startY = ty * 2;
            const startX = tx * 2;
            
            grid[startY][startX] = color;
            grid[startY+1][startX] = color;
            grid[startY][startX+1] = color;
            grid[startY+1][startX+1] = color;
        }
    }
}


function handleGenerateBackground() {
    cancelTextPlacementMode();
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
        generateRandomRects,
        generateTetrisPattern,
    ];

    try {
        setTimeout(() => {
            let hasMask = false;
            if (pixelData.size > 0) {
                 for (const color of pixelData.values()) {
                    if (color === MASK_COLOR) {
                        hasMask = true;
                        break;
                    }
                 }
            }

            const newPattern: string[][] = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'));
            const generator = generators[Math.floor(Math.random() * generators.length)];
            generator(newPattern);

            if (hasMask) {
                generatedBackgroundData = newPattern;
            } else {
                generatedBackgroundData = null;
                saveState();
                pixelData.clear();
                for (let y = 0; y < gridHeight; y++) {
                    for (let x = 0; x < gridWidth; x++) {
                        setPixel(x + artboardOffset.x, y + artboardOffset.y, newPattern[y][x]);
                    }
                }
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
    cancelTextPlacementMode();
    commitGeneratedBackground();

    let hasMask = false;
    for (const color of pixelData.values()) {
        if (color === MASK_COLOR) {
            hasMask = true;
            break;
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
    for (const [key, color] of pixelData.entries()) {
        if (color === MASK_COLOR) {
            const [x, y] = key.split(',').map(Number);
            const neighbors = [
                [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]
            ];

            let isBorder = false;
            for (const [nx, ny] of neighbors) {
                if (getPixel(nx, ny) !== MASK_COLOR) {
                    isBorder = true;
                    break;
                }
            }

            if (isBorder) {
                borderPixels.push({ x, y });
            }
        }
    }

    if (borderPixels.length === 0) return;
    
    for (const { x, y } of borderPixels) {
        setPixel(x, y, selectedColor);
    }

    renderCanvas();
}


function placeTextOnCanvas(event: MouseEvent) {
    const coords = screenToGrid(event);
    if (!coords) return;

    drawTextAt(coords.x, coords.y);
    cancelTextPlacementMode();
}

function drawTextAt(startX: number, startY: number) {
    const text = textInput.value;
    if (!text) {
        alert("Please enter some text to add.");
        return;
    }
    
    if (selectedColor === MASK_COLOR) {
        alert("Please select a color for the text, not the mask tool itself.");
        return;
    }

    const textSize = parseInt(textSizeInput.value, 10);
    if (isNaN(textSize) || textSize < 1) {
        alert("Please enter a valid text size (1 or greater).");
        return;
    }

    saveState();
    commitGeneratedBackground();

    let currentX = startX;

    for (const char of text) {
        const charBitmap = PIXEL_FONT[char] || PIXEL_FONT['?'];
        const charHeight = charBitmap.length;
        const charWidth = charBitmap[0].length;

        for (let y = 0; y < charHeight; y++) {
            for (let x = 0; x < charWidth; x++) {
                if (charBitmap[y][x] === 1) {
                    for (let scaleY = 0; scaleY < textSize; scaleY++) {
                        for (let scaleX = 0; scaleX < textSize; scaleX++) {
                            const gridX = currentX + (x * textSize) + scaleX;
                            const gridY = startY + (y * textSize) + scaleY;
                            setPixel(gridX, gridY, selectedColor);
                        }
                    }
                }
            }
        }
        currentX += (charWidth * textSize) + (1 * textSize);
    }

    renderCanvas();
}


/**
 * Generic file saving function. Uses the File System Access API if available,
 * otherwise falls back to the traditional anchor link download method.
 */
async function saveFile(
    suggestedName: string,
    fileTypes: { description: string; accept: { [mimeType: string]: string[] } }[],
    blob: Blob
) {
    // Feature detection for the API
    if (window.showSaveFilePicker) {
        try {
            // Show the "Save As" dialog
            const handle = await window.showSaveFilePicker({
                suggestedName,
                types: fileTypes,
            });
            // Write the blob to the file
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return; // Exit after successful save
        } catch (err) {
            // This error is thrown if the user clicks "Cancel"
            if ((err as DOMException).name === 'AbortError') {
                return;
            }
            console.error('Error using showSaveFilePicker:', err);
            // Fall through to the fallback method if there's an unexpected error
        }
    }

    // Fallback for browsers that don't support the API
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = suggestedName;
    link.href = url;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function handleDownload() {
    commitGeneratedBackground();

    // Check if there's any non-masked art in the current viewport to export.
    let hasArtInView = false;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (getPixel(x + artboardOffset.x, y + artboardOffset.y) !== MASK_COLOR) {
                hasArtInView = true;
                break;
            }
        }
        if (hasArtInView) break;
    }

    if (!hasArtInView) {
        alert("There is no visible artwork in the current view to export. Try removing the mask or drawing something.");
        return;
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // --- Proportions from SVG export ---
    // Physical dimensions in millimeters for ratio calculation
    const diameter_mm = 1.68;
    const horizontal_space_between_mm = 0.923;
    const vertical_space_between_mm = 1.315;

    // Center-to-center distance for the circles in mm
    const horizontal_step_mm = diameter_mm + horizontal_space_between_mm;
    const vertical_step_mm = diameter_mm + vertical_space_between_mm;

    // --- Convert to Pixel dimensions ---
    const diameter_px = 40; // Base resolution for the PNG export
    const radius_px = diameter_px / 2;

    // Calculate pixel step sizes based on the millimeter ratios
    const horizontal_step_px = (horizontal_step_mm / diameter_mm) * diameter_px;
    const vertical_step_px = (vertical_step_mm / diameter_mm) * diameter_px;

    // A margin around the artwork in pixels
    const margin_px = Math.max(horizontal_step_px, vertical_step_px);

    // Calculate the total size of the artwork area (from first circle center to last circle center)
    const artAreaWidth_px = (gridWidth > 1) ? (gridWidth - 1) * horizontal_step_px : 0;
    const artAreaHeight_px = (gridHeight > 1) ? (gridHeight - 1) * vertical_step_px : 0;

    // Calculate the final canvas dimensions including margins
    tempCanvas.width = Math.round(artAreaWidth_px + 2 * margin_px);
    tempCanvas.height = Math.round(artAreaHeight_px + 2 * margin_px);

    // Draw background
    tempCtx.fillStyle = '#000000';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Iterate through the current viewport and draw circles
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const artX = x + artboardOffset.x;
            const artY = y + artboardOffset.y;
            const color = getPixel(artX, artY);

            if (color !== MASK_COLOR) {
                // Calculate circle center position in pixels
                const cx = margin_px + x * horizontal_step_px;
                const cy = margin_px + y * vertical_step_px;
                
                tempCtx.beginPath();
                tempCtx.arc(cx, cy, radius_px, 0, 2 * Math.PI, false);
                tempCtx.fillStyle = color;
                tempCtx.fill();
            }
        }
    }

    const blob = await new Promise<Blob | null>(resolve => tempCanvas.toBlob(resolve, 'image/png'));
    if (!blob) {
        alert("Failed to create image blob for download.");
        return;
    }

    await saveFile('pixel-art.png', [{
        description: 'PNG Image',
        accept: { 'image/png': ['.png'] }
    }], blob);
}

async function handleDownloadSVG() {
    commitGeneratedBackground();

    // Check if there's any non-masked art in the current viewport to export.
    let hasArtInView = false;
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if (getPixel(x + artboardOffset.x, y + artboardOffset.y) !== MASK_COLOR) {
                hasArtInView = true;
                break;
            }
        }
        if (hasArtInView) break;
    }

    if (!hasArtInView) {
        alert("There is no visible artwork in the current view to export. Try removing the mask or drawing something.");
        return;
    }

    // Physical dimensions in millimeters as per user request
    const diameter_mm = 1.68;
    const radius_mm = diameter_mm / 2;
    const horizontal_space_between_mm = 0.923;
    const vertical_space_between_mm = 1.315;

    // Center-to-center distance for the circles
    const horizontal_step_mm = diameter_mm + horizontal_space_between_mm; // 2.603 mm
    const vertical_step_mm = diameter_mm + vertical_space_between_mm; // 2.995 mm

    // A margin around the artwork
    const margin_mm = Math.max(horizontal_step_mm, vertical_step_mm);

    // Calculate the total size of the artwork area (from first circle center to last circle center)
    const artAreaWidth = (gridWidth > 1) ? (gridWidth - 1) * horizontal_step_mm : 0;
    const artAreaHeight = (gridHeight > 1) ? (gridHeight - 1) * vertical_step_mm : 0;

    // Calculate the final SVG dimensions including margins
    const totalWidth_mm = artAreaWidth + 2 * margin_mm;
    const totalHeight_mm = artAreaHeight + 2 * margin_mm;

    let svgContent = `<svg width="${totalWidth_mm.toFixed(3)}mm" height="${totalHeight_mm.toFixed(3)}mm" viewBox="0 0 ${totalWidth_mm.toFixed(3)} ${totalHeight_mm.toFixed(3)}" xmlns="http://www.w3.org/2000/svg">\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#000000" />\n`;

    // Iterate through the current viewport
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const artX = x + artboardOffset.x;
            const artY = y + artboardOffset.y;
            const color = getPixel(artX, artY);

            if (color !== MASK_COLOR) {
                // Calculate circle center position
                const cx = margin_mm + x * horizontal_step_mm;
                const cy = margin_mm + y * vertical_step_mm;
                
                svgContent += `  <circle cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="${radius_mm}" fill="${color}" />\n`;
            }
        }
    }
    
    svgContent += '</svg>';

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    
    await saveFile('pixel-art.svg', [{
        description: 'SVG Image',
        accept: { 'image/svg+xml': ['.svg'] }
    }], blob);
}

async function handleSaveProject() {
    commitGeneratedBackground();

    if (pixelData.size === 0) {
        alert("There is nothing to save. Create some art first!");
        return;
    }

    const projectData = {
        gridWidth,
        gridHeight,
        artboardOffset,
        pixelData: Array.from(pixelData.entries()),
    };

    const jsonString = JSON.stringify(projectData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    await saveFile('pixel-art-project.pixelart', [{
        description: 'Pixel Art Project File',
        accept: { 'application/json': ['.pixelart'] }
    }], blob);
}

function handleScaleChange(event: Event) {
    if (!originalImage) return;
    scale = parseFloat((event.target as HTMLInputElement).value);
    processImage();
}

function handleToolChange() {
    cancelTextPlacementMode();
    const selectedTool = brushToolSelect.value;
    brushSizeInput.disabled = selectedTool === 'pencil';
}

function togglePanMode() {
    isPanMode = !isPanMode;
    if (isPanMode) {
        cancelTextPlacementMode();
    }
    panModeBtn.classList.toggle('active', isPanMode);
    canvas.style.cursor = isPanMode ? 'grab' : 'default';
}

function toggleLightEffect() {
    isGlowEnabled = !isGlowEnabled;
    lightEffectBtn.classList.toggle('active', isGlowEnabled);
    renderCanvas();
}

function handlePanStart(event: MouseEvent) {
    if (!isPanMode) return;
    isDragging = true;
    dragStart = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = 'grabbing';
    generatedBackgroundData = null; // Cancel temp background on pan
}

function handlePanMove(event: MouseEvent) {
    if (!isDragging || !isPanMode) return;
    
    panOffset.x = event.clientX - dragStart.x;
    panOffset.y = event.clientY - dragStart.y;
    
    if (resizeAnimationFrameId) {
        window.cancelAnimationFrame(resizeAnimationFrameId);
    }
    resizeAnimationFrameId = window.requestAnimationFrame(renderCanvas);
}

function handlePanEnd() {
    if (!isPanMode || !isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';

    const spacing = getSpacing();
    const panCellsX = Math.round(panOffset.x / spacing);
    const panCellsY = Math.round(panOffset.y / spacing);

    if (panCellsX === 0 && panCellsY === 0) {
        panOffset = { x: 0, y: 0 };
        renderCanvas();
        return;
    }
    
    saveState(); // Save state before the pan is committed
    
    // Non-destructive pan: update the artboard offset
    artboardOffset.x -= panCellsX;
    artboardOffset.y -= panCellsY;

    // Reset pan offset and render the final committed state
    panOffset = { x: 0, y: 0 };
    renderCanvas();
}

function handleUndo() {
    cancelTextPlacementMode();
    if (historyStack.length === 0) return;
    generatedBackgroundData = null; // Clear temp background when undoing
    
    const currentState = {
        pixelData: new Map(pixelData),
        artboardOffset: { ...artboardOffset }
    };
    redoStack.push(currentState);

    const previousState = historyStack.pop()!;
    pixelData = new Map(previousState.pixelData);
    artboardOffset = { ...previousState.artboardOffset };

    renderCanvas();
    updateUndoRedoButtons();
}

function handleRedo() {
    cancelTextPlacementMode();
    if (redoStack.length === 0) return;
    generatedBackgroundData = null; // Clear temp background when redoing
    
    const currentState = {
        pixelData: new Map(pixelData),
        artboardOffset: { ...artboardOffset }
    };
    historyStack.push(currentState);
    if (historyStack.length > MAX_HISTORY_SIZE) {
        historyStack.shift();
    }
    
    const nextState = redoStack.pop()!;
    pixelData = new Map(nextState.pixelData);
    artboardOffset = { ...nextState.artboardOffset };
    renderCanvas();
    updateUndoRedoButtons();
}


// --- TOOL IMPLEMENTATIONS ---

function getPixel(x: number, y: number): string {
    return pixelData.get(`${x},${y}`) || '#ffffff';
}

function setPixel(x: number, y: number, color: string) {
    if (color === '#ffffff') {
        pixelData.delete(`${x},${y}`); // Optimization: don't store default color
    } else {
        pixelData.set(`${x},${y}`, color);
    }
}

function drawPencil(x: number, y: number) {
    setPixel(x, y, selectedColor);
}

function drawSquare(x: number, y: number) {
    const brushSize = parseInt(brushSizeInput.value, 10) || 1;
    const startX = x - Math.floor(brushSize / 2);
    const startY = y - Math.floor(brushSize / 2);
    const endX = startX + brushSize;
    const endY = startY + brushSize;

    for (let i = startY; i < endY; i++) {
        for (let j = startX; j < endX; j++) {
            setPixel(j, i, selectedColor);
        }
    }
}

function drawCircle(centerX: number, centerY: number) {
    const brushSize = parseInt(brushSizeInput.value, 10) || 1;

    if (brushSize in SMALL_CIRCLE_PATTERNS) {
        const pattern = SMALL_CIRCLE_PATTERNS[brushSize as keyof typeof SMALL_CIRCLE_PATTERNS];
        const offset = Math.floor(brushSize / 2);
        for (const p of pattern) {
            const x = centerX + p[0] - offset;
            const y = centerY + p[1] - offset;
            setPixel(x, y, selectedColor);
        }
        return;
    }

    const radius = brushSize / 2;
    const startY = Math.floor(centerY - radius);
    const endY = Math.ceil(centerY + radius);
    const startX = Math.floor(centerX - radius);
    const endX = Math.ceil(centerX + radius);

    for (let i = startY; i < endY; i++) {
        for (let j = startX; j < endX; j++) {
            const dx = j - centerX;
            const dy = i - centerY;
            if (Math.sqrt(dx * dx + dy * dy) < radius) {
                setPixel(j, i, selectedColor);
            }
        }
    }
}


function globalFill(x: number, y: number) {
    const targetColor = getPixel(x, y);
    if (targetColor === selectedColor) return;

    const keysToUpdate: string[] = [];
    for (const [key, color] of pixelData.entries()) {
        if (color === targetColor) {
            keysToUpdate.push(key);
        }
    }
    for (const key of keysToUpdate) {
        pixelData.set(key, selectedColor);
    }
}

function floodFill(startX: number, startY: number) {
    const targetColor = getPixel(startX, startY);
    if (targetColor === selectedColor) return;

    const q: [number, number][] = [[startX, startY]];
    const visited = new Set<string>([`${startX},${startY}`]);
    let processed = 0;
    const limit = gridWidth * gridHeight; // Safety limit is now the size of the viewport

    // Define viewport boundaries in absolute coordinates
    const minX = artboardOffset.x;
    const minY = artboardOffset.y;
    const maxX = artboardOffset.x + gridWidth;
    const maxY = artboardOffset.y + gridHeight;

    while (q.length > 0) {
        const [x, y] = q.shift()!;
        setPixel(x, y, selectedColor);
        processed++;
        if (processed > limit) {
            console.warn("Flood fill limit reached.");
            break;
        }

        const neighbors: [number, number][] = [
            [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
        ];
        for (const [nx, ny] of neighbors) {
            // Boundary check: ensure the neighbor is within the viewport
            if (nx < minX || nx >= maxX || ny < minY || ny >= maxY) {
                continue;
            }

            const key = `${nx},${ny}`;
            if (!visited.has(key) && getPixel(nx, ny) === targetColor) {
                visited.add(key);
                q.push([nx, ny]);
            }
        }
    }
}

// --- HELPER FUNCTIONS ---

function toggleTextPlacementMode() {
    isTextPlacementMode = !isTextPlacementMode;
    placeTextBtn.classList.toggle('active', isTextPlacementMode);
    placeTextBtn.textContent = isTextPlacementMode ? 'Click on Canvas to Place' : 'Add Text';
    canvas.style.cursor = isTextPlacementMode ? 'crosshair' : (isPanMode ? 'grab' : 'default');

    if (isTextPlacementMode && isPanMode) {
        togglePanMode(); 
    }
}

function cancelTextPlacementMode() {
    if (isTextPlacementMode) {
        isTextPlacementMode = false;
        placeTextBtn.classList.remove('active');
        placeTextBtn.textContent = 'Add Text';
        canvas.style.cursor = isPanMode ? 'grab' : 'default';
    }
}

/**
 * Merges the temporary generated background into the main pixelData.
 */
function commitGeneratedBackground(): boolean {
    if (!generatedBackgroundData) return false;

    let modified = false;
    const keysToUpdate: {x: number, y: number}[] = [];

    // Find all mask pixels
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const ax = x + artboardOffset.x;
            const ay = y + artboardOffset.y;
            if (getPixel(ax, ay) === MASK_COLOR) {
                setPixel(ax, ay, generatedBackgroundData[y][x]);
                modified = true;
            }
        }
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
        pixelData.clear();
        renderCanvas();
        return;
    }

    generatedBackgroundData = null;
    resetHistory();

    // 1. Determine base dimensions (unscaled) to fit the current viewport aspect ratio
    const imgAspectRatio = originalImage.width / originalImage.height;
    const gridAspectRatio = gridWidth / gridHeight;
    let baseGridWidth, baseGridHeight;

    if (imgAspectRatio > gridAspectRatio) {
        baseGridWidth = gridWidth;
        baseGridHeight = gridWidth / imgAspectRatio;
    } else {
        baseGridHeight = gridHeight;
        baseGridWidth = gridHeight * imgAspectRatio;
    }

    // 2. Calculate the final, scaled grid dimensions for the entire image
    const finalGridWidth = Math.round(baseGridWidth * scale);
    const finalGridHeight = Math.round(baseGridHeight * scale);
    
    if (finalGridWidth < 1 || finalGridHeight < 1) {
        pixelData.clear();
        renderCanvas();
        return;
    }

    // 3. Create a temporary canvas of the exact required pixel dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = finalGridWidth;
    tempCanvas.height = finalGridHeight;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;

    // 4. Draw the original image onto this temp canvas, effectively resampling it
    tempCtx.drawImage(originalImage, 0, 0, finalGridWidth, finalGridHeight);
    
    const imageData = tempCtx.getImageData(0, 0, finalGridWidth, finalGridHeight);
    const data = imageData.data;
    
    // 5. Posterization setup
    const colorLevels = parseInt(colorDetailSlider.value, 10);
    const factor = 255 / (colorLevels - 1);

    // 6. Clear old pixel data and prepare to place the new, centered art
    pixelData.clear();
    artboardOffset = { x: 0, y: 0 }; // Reset viewport to top-left
    
    // Calculate where the top-left of the new artwork should go to be centered in the viewport
    const artworkStartX = Math.floor((gridWidth - finalGridWidth) / 2);
    const artworkStartY = Math.floor((gridHeight - finalGridHeight) / 2);
    
    // 7. Iterate over the entire resampled image and place pixels on the infinite grid
    for (let y = 0; y < finalGridHeight; y++) {
        for (let x = 0; x < finalGridWidth; x++) {
            const i = (y * finalGridWidth + x) * 4;
            let color = '#ffffff'; // Default to white for transparent areas
            
            if (data[i + 3] >= 128) { // Consider pixel opaque
                const r = Math.round(data[i] / factor) * factor;
                const g = Math.round(data[i+1] / factor) * factor;
                const b = Math.round(data[i+2] / factor) * factor;
                color = findClosestColor(r, g, b);
            }
            
            if(color !== '#ffffff') {
               setPixel(x + artworkStartX, y + artworkStartY, color);
            }
        }
    }
    
    renderCanvas();
}


function selectColor(color: string) {
    selectedColor = color;
    document.querySelectorAll('.color-swatch-wrapper').forEach(w => w.classList.remove('selected'));
    const newSelectedWrapper = colorPaletteContainer.querySelector(`.color-swatch-wrapper[data-color="${color}"]`);
    newSelectedWrapper?.classList.add('selected');
}

function updateColorPalette() {
    colorPaletteContainer.innerHTML = '';
    
    const allSwatches = [...LIMITED_PALETTE, MASK_COLOR];

    allSwatches.forEach(color => {
        const wrapper = document.createElement('div');
        wrapper.className = 'color-swatch-wrapper';
        wrapper.dataset.color = color;

        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        
        if (color === MASK_COLOR) {
            swatch.classList.add('mask-swatch');
            swatch.title = 'Masking Area (for background generation)';
        } else {
            swatch.style.backgroundColor = color === LIMITED_PALETTE[0] ? CANVAS_DOT_COLOR_FOR_BLACK : color;
        }

        const count = document.createElement('span');
        count.className = 'color-count';
        count.dataset.countColor = color;
        count.textContent = '0';

        wrapper.appendChild(swatch);
        wrapper.appendChild(count);

        if (color === selectedColor) {
            wrapper.classList.add('selected');
        }

        wrapper.addEventListener('click', () => selectColor(color));
        colorPaletteContainer.appendChild(wrapper);
    });

    updateColorCounts();
}

function updateColorCounts() {
    const counts: { [key: string]: number } = {};
    // Initialize all possible colors to 0
    [...LIMITED_PALETTE, MASK_COLOR].forEach(c => counts[c] = 0);

    // Iterate through the visible viewport only
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            // Get the color from the artboard at the viewport's position
            const color = getPixel(x + artboardOffset.x, y + artboardOffset.y);
            
            // Increment the count for that color
            if (counts.hasOwnProperty(color)) {
                counts[color]++;
            }
        }
    }

    // Update the UI with the new counts
    for (const color in counts) {
        const countEl = colorPaletteContainer.querySelector(`.color-count[data-count-color="${color}"]`) as HTMLSpanElement;
        if (countEl) {
            countEl.textContent = counts[color].toString();
        }
    }
}


function updateTransformControlsState(enabled: boolean) {
    scaleSlider.disabled = !enabled;
    colorDetailSlider.disabled = !enabled;
}

function resetTransforms() {
    scale = 1.0;
    scaleSlider.value = '1';
    panOffset = { x: 0, y: 0 };
    artboardOffset = { x: 0, y: 0 };
    if (isPanMode) {
        isPanMode = false;
        panModeBtn.classList.remove('active');
        canvas.style.cursor = 'default';
    }
}

function saveState() {
    const state = {
        pixelData: new Map(pixelData),
        artboardOffset: { ...artboardOffset }
    };
    historyStack.push(state);
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
        const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
        return { hex, lab };
    });
}

/**
 * Finds the closest color in the palette using a hybrid approach.
 * It uses the perceptually uniform CIE LAB color space for distance calculation,
 * but adds heuristics based on HSL hue to correct common mapping errors,
 * like blue tones being mapped to purple or black.
 */
function findClosestColor(r: number, g: number, b: number): string {
    const inputLab = rgbToLab(r, g, b);
    const inputHsl = rgbToHsl(r, g, b);

    // Heuristic: Check HSL hue to identify if a color is broadly "blue".
    // This is more stable for this purpose than checking LAB values for desaturated colors.
    // The range 180 (cyan) to 280 (violet-blue) captures most blues without grabbing purple (around hue 300).
    const isInputBlueHue = inputHsl.h >= 180 && inputHsl.h <= 280;

    let closestColor = '';
    let minDistance = Infinity;

    if (labPaletteCache.length === 0) return '#ffffff';

    for (const paletteColor of labPaletteCache) {
        const dL = inputLab.l - paletteColor.lab.l;
        const dA = inputLab.a - paletteColor.lab.a;
        const dB = inputLab.b - paletteColor.lab.b;
        
        let distance = Math.sqrt(dL * dL + dA * dA + dB * dB);

        // --- Color Correction Heuristics ---
        if (isInputBlueHue) {
            const paletteIsPurple = paletteColor.hex === '#9a0f9a';
            const paletteIsBlack = paletteColor.hex === '#222222';

            // If the input color has a blue-ish hue...
            if (paletteIsPurple) {
                // ...penalize matching it to purple. This makes it a less attractive choice.
                distance *= 1.5;
            }
            // ...penalize matching it to black, but only if the color isn't extremely dark itself.
            // This prevents dark navy from becoming black.
            if (paletteIsBlack && inputLab.l > 20) { 
                distance *= 1.2;
            }
        }

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = paletteColor.hex;
        }
    }
    
    return closestColor || labPaletteCache[0].hex;
}


function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s, l: l };
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