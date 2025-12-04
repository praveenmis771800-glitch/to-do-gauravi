// ===== GLOBAL STATE =====
let tasks = [];
let currentFilter = "all";
let dynamoDB = null;
let awsConfig = {
	region: "",
	accessKeyId: "",
	secretAccessKey: "",
	tableName: "TodoList",
};

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    loadConfig();
    loadTasks();
    updateDateTime();
    // Update clock every second
    setInterval(updateDateTime, 1000);
});

// ===== AWS CONFIGURATION =====
function toggleConfig() {
	const content = document.getElementById("configContent");
	const icon = document.getElementById("toggleIcon");

	content.classList.toggle("expanded");
	icon.classList.toggle("rotated");
}

function saveConfig() {
	const region = document.getElementById("awsRegion").value.trim();
	const accessKey = document.getElementById("awsAccessKey").value.trim();
	const secretKey = document.getElementById("awsSecretKey").value.trim();
	const tableName = document.getElementById("tableName").value.trim();

	if (!region || !accessKey || !secretKey || !tableName) {
		showToast("Please fill in all AWS configuration fields", "error");
		return;
	}

	awsConfig = {
		region,
		accessKeyId: accessKey,
		secretAccessKey: secretKey,
		tableName,
	};

	// Save to localStorage (Note: For production, use more secure methods)
	localStorage.setItem(
		"awsConfig",
		JSON.stringify({
			region,
			tableName,
			// Don't store credentials in production - use AWS Cognito instead
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
		})
	);

	initializeAWS();
}

function loadConfig() {
	const savedConfig = localStorage.getItem("awsConfig");
	if (savedConfig) {
		const config = JSON.parse(savedConfig);
		awsConfig = config;

		document.getElementById("awsRegion").value = config.region;
		document.getElementById("awsAccessKey").value = config.accessKeyId || "";
		document.getElementById("awsSecretKey").value =
			config.secretAccessKey || "";
		document.getElementById("tableName").value = config.tableName;

		initializeAWS();
	}
}

function initializeAWS() {
    try {
        // Check if AWS SDK is loaded
        if (typeof AWS === 'undefined') {
            throw new Error('AWS SDK not loaded. Please refresh the page.');
        }

        // Check if we have valid credentials
        if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey || !awsConfig.region) {
            console.log('AWS credentials not configured yet');
            return;
        }

        AWS.config.update({
            region: awsConfig.region,
            credentials: new AWS.Credentials({
                accessKeyId: awsConfig.accessKeyId,
                secretAccessKey: awsConfig.secretAccessKey,
            }),
        });

        dynamoDB = new AWS.DynamoDB.DocumentClient();

        // Test connection
        testConnection();
    } catch (error) {
        console.error("AWS initialization failed:", error);
        showConnectionStatus("Failed to initialize AWS: " + error.message, "error");
    }
}

function testConnection() {
	if (!dynamoDB) {
		showConnectionStatus("Please configure AWS credentials first", "error");
		return;
	}

	const params = {
		TableName: awsConfig.tableName,
		Limit: 1,
	};

	dynamoDB.scan(params, (err, data) => {
		if (err) {
			console.error("Connection test failed:", err);
			showConnectionStatus("Connection failed: " + err.message, "error");
		} else {
			showConnectionStatus(
				"✅ Connected to AWS DynamoDB successfully!",
				"success"
			);
			loadTasksFromDynamoDB();
		}
	});
}

function showConnectionStatus(message, type) {
	const statusDiv = document.getElementById("connectionStatus");
	statusDiv.textContent = message;
	statusDiv.className = `connection-status ${type}`;
}

// ===== TASK MANAGEMENT =====
function addTask() {
	const input = document.getElementById("taskInput");
	const taskText = input.value.trim();

	if (taskText === "") {
		showToast("Please enter a task", "error");
		return;
	}

	const task = {
		id: Date.now().toString(),
		text: taskText,
		completed: false,
		createdAt: new Date().toISOString(),
	};

	tasks.unshift(task);
	input.value = "";

	saveTaskToDynamoDB(task);
	renderTasks();
	showToast("Task added successfully! 💖", "success");
}

function toggleTask(id) {
	const task = tasks.find((t) => t.id === id);
	if (task) {
		task.completed = !task.completed;
		updateTaskInDynamoDB(task);
		renderTasks();
	}
}

function deleteTask(id) {
	const taskIndex = tasks.findIndex((t) => t.id === id);
	if (taskIndex !== -1) {
		tasks.splice(taskIndex, 1);
		deleteTaskFromDynamoDB(id);
		renderTasks();
		showToast("Task deleted", "success");
	}
}

function filterTasks(filter) {
	currentFilter = filter;

	// Update active filter button
	document.querySelectorAll(".filter-btn").forEach((btn) => {
		btn.classList.remove("active");
		if (btn.dataset.filter === filter) {
			btn.classList.add("active");
		}
	});

	renderTasks();
}

function handleKeyPress(event) {
	if (event.key === "Enter") {
		addTask();
	}
}

// ===== RENDERING =====
function renderTasks() {
	const taskList = document.getElementById("taskList");
	const emptyState = document.getElementById("emptyState");
	const activeCount = document.getElementById("activeCount");

	let filteredTasks = tasks;
	if (currentFilter === "active") {
		filteredTasks = tasks.filter((t) => !t.completed);
	} else if (currentFilter === "completed") {
		filteredTasks = tasks.filter((t) => t.completed);
	}

	// Update active count
	const activeTasks = tasks.filter((t) => !t.completed).length;
	activeCount.textContent = activeTasks;

	// Clear task list
	taskList.innerHTML = "";

	if (filteredTasks.length === 0) {
		emptyState.classList.remove("hidden");
		return;
	}

	emptyState.classList.add("hidden");

	filteredTasks.forEach((task) => {
		const li = document.createElement("li");
		li.className = `task-item ${task.completed ? "completed" : ""}`;
		li.innerHTML = `
            <label class="task-checkbox">
                <input 
                    type="checkbox" 
                    ${task.completed ? "checked" : ""} 
                    onchange="toggleTask('${task.id}')"
                >
                <span class="checkmark"></span>
            </label>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="btn-delete" onclick="deleteTask('${
									task.id
								}')" title="Delete task">
                    🗑️
                </button>
            </div>
        `;
		taskList.appendChild(li);
	});
}

// ===== DYNAMODB OPERATIONS =====
function saveTaskToDynamoDB(task) {
	if (!dynamoDB) {
		console.warn("DynamoDB not initialized. Task saved locally only.");
		saveTasks();
		return;
	}

	const params = {
		TableName: awsConfig.tableName,
		Item: {
			id: task.id,
			text: task.text,
			completed: task.completed,
			createdAt: task.createdAt,
		},
	};

	dynamoDB.put(params, (err, data) => {
		if (err) {
			console.error("Error saving to DynamoDB:", err);
			showToast("Failed to sync with cloud. Saved locally.", "error");
			saveTasks(); // Fallback to localStorage
		} else {
			console.log("Task saved to DynamoDB:", task.id);
		}
	});
}

function updateTaskInDynamoDB(task) {
	if (!dynamoDB) {
		saveTasks();
		return;
	}

	const params = {
		TableName: awsConfig.tableName,
		Key: { id: task.id },
		UpdateExpression: "set completed = :c",
		ExpressionAttributeValues: {
			":c": task.completed,
		},
	};

	dynamoDB.update(params, (err, data) => {
		if (err) {
			console.error("Error updating in DynamoDB:", err);
			saveTasks();
		} else {
			console.log("Task updated in DynamoDB:", task.id);
		}
	});
}

function deleteTaskFromDynamoDB(id) {
	if (!dynamoDB) {
		saveTasks();
		return;
	}

	const params = {
		TableName: awsConfig.tableName,
		Key: { id: id },
	};

	dynamoDB.delete(params, (err, data) => {
		if (err) {
			console.error("Error deleting from DynamoDB:", err);
			saveTasks();
		} else {
			console.log("Task deleted from DynamoDB:", id);
		}
	});
}

function loadTasksFromDynamoDB() {
	if (!dynamoDB) {
		loadTasks();
		return;
	}

	const params = {
		TableName: awsConfig.tableName,
	};

	dynamoDB.scan(params, (err, data) => {
		if (err) {
			console.error("Error loading from DynamoDB:", err);
			showToast("Failed to load from cloud. Using local data.", "error");
			loadTasks();
		} else {
			if (data.Items && data.Items.length > 0) {
				tasks = data.Items.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
				// Also save to localStorage as backup
				saveTasks();
			} else {
				loadTasks();
			}
			renderTasks();
			console.log("Loaded tasks from DynamoDB:", tasks.length);
		}
	});
}

// ===== LOCAL STORAGE (FALLBACK) =====
function saveTasks() {
	localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function loadTasks() {
	const savedTasks = localStorage.getItem("todoTasks");
	if (savedTasks) {
		tasks = JSON.parse(savedTasks);
		renderTasks();
	}
}

// ===== UTILITIES =====
function showToast(message, type = "success") {
	const toast = document.getElementById("toast");
	toast.textContent = message;
	toast.className = `toast ${type} show`;

	setTimeout(() => {
		toast.classList.remove("show");
	}, 3000);
}

function escapeHtml(text) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}



// ===== DATE & TIME =====
function updateDateTime() {
    const now = new Date();
    
    // Update Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = hours + ':' + minutes + ':' + seconds;
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    // Update Date
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    
    const dateString = month + ' ' + day;
    
    const dateElement = document.getElementById('currentDate');
    const yearElement = document.getElementById('currentYear');
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
    if (yearElement) {
        yearElement.textContent = year;
    }
}
