<?php
// Database connection credentials
$host = getenv("DB_HOST");
$user = getenv("DB_USER");
$password = getenv("DB_PASSWORD");
$database = getenv("DB_NAME");
$port = getenv("DB_PORT");


// Create connection
$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get request path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathSegments = explode('/', $path);
$projectId = isset($pathSegments[count($pathSegments) - 1]) ? $pathSegments[count($pathSegments) - 1] : null;

// Handle different request methods
switch ($method) {
    case 'GET':
        if ($projectId && is_numeric($projectId)) {
            // Get a specific project
            $sql = "SELECT * FROM projects WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $projectId);
            $stmt->execute();
            $result = $stmt->get_result();
            $project = $result->fetch_assoc();
            
            if ($project) {
                echo json_encode($project);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Project not found"]);
            }
        } else {
            // Get all projects
            $sql = "SELECT * FROM projects ORDER BY id DESC";
            $result = $conn->query($sql);
            $projects = [];
            
            while ($row = $result->fetch_assoc()) {
                $projects[] = $row;
            }
            
            echo json_encode($projects);
        }
        break;
        
    case 'POST':
        // Add a new project
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['title']) || !isset($data['description']) || !isset($data['image'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required fields"]);
            break;
        }
        
        $title = $data['title'];
        $description = $data['description'];
        $image = $data['image'];
        $techStack = isset($data['techStack']) ? json_encode($data['techStack']) : '[]';
        $githubUrl = isset($data['githubUrl']) ? $data['githubUrl'] : '';
        $demoUrl = isset($data['demoUrl']) ? $data['demoUrl'] : '';
        
        $sql = "INSERT INTO projects (title, description, image, tech_stack, github_url, demo_url) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $title, $description, $image, $techStack, $githubUrl, $demoUrl);
        
        if ($stmt->execute()) {
            $newProjectId = $conn->insert_id;
            $responseData = [
                "id" => $newProjectId,
                "title" => $title,
                "description" => $description,
                "image" => $image,
                "techStack" => json_decode($techStack),
                "githubUrl" => $githubUrl,
                "demoUrl" => $demoUrl
            ];
            
            http_response_code(201);
            echo json_encode($responseData);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create project"]);
        }
        break;
        
    case 'DELETE':
        // Delete a project
        if (!$projectId || !is_numeric($projectId)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid project ID"]);
            break;
        }
        
        $sql = "DELETE FROM projects WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $projectId);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(["message" => "Project deleted successfully"]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Project not found"]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete project"]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

// Close connection
$conn->close();
?>
