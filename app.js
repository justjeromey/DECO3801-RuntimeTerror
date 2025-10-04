const { spawnSync, spawn } = require('child_process');
const path = require('path');

const rootPath = __dirname;
const backendPath = path.join(rootPath, 'backend');
const frontendPath = path.join(rootPath, 'trailrunners');

// .venv setup and requirements installation
console.log('Setting up backend virtualenv...');
spawnSync('python3', ['-m', 'venv', '.venv'], {
    cwd: rootPath, stdio: 'inherit', shell: true
});

console.log('Installing backend requirements...');
spawnSync(path.join(rootPath, '.venv/bin/pip'), ['install', '-r', 'requirements.txt'], {
    cwd: backendPath, stdio: 'inherit', shell: true
});

// Npm installation and build
console.log('Installing frontend dependencies...');
spawnSync('npm', ['install', '--production'], {
    cwd: frontendPath, stdio: 'inherit', shell: true
});

console.log('Building frontend...');
spawnSync('npm', ['run', 'build'], {
    cwd: frontendPath, stdio: 'inherit', shell: true
});

// Start backend
console.log('Starting FastAPI backend...');
const backend = spawn(
    path.join(rootPath, '.venv/bin/python'),
    ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'],
    { cwd: backendPath, stdio: 'inherit' }
);

// Start front end 
console.log('Starting Next.js frontend on port 8081...');
const frontend = spawn(
    'node',
    ['./node_modules/next/dist/bin/next', 'start', '-p', '8081'],
    { cwd: frontendPath, stdio: 'inherit' }
);

// Keep main process alive
process.stdin.resume();

// Shutdown
function shutdown() {
    console.log('\nShutting down...');
    backend.kill();
    frontend.kill();
    process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
