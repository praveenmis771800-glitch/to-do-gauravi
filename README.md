# ✨ Cloud To-Do List ✨

A beautiful, cloud-powered to-do list application with a girly theme, backed by **AWS DynamoDB** for seamless cloud storage and synchronization.

![Cloud To-Do List](https://img.shields.io/badge/AWS-DynamoDB-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🌸 Features

- **☁️ Cloud Storage**: Tasks are stored in AWS DynamoDB for persistent storage
- **💖 Beautiful UI**: Girly theme with pastel colors, gradients, and smooth animations
- **✨ Real-time Sync**: Automatic synchronization with the cloud
- **🎯 Task Filtering**: View all, active, or completed tasks
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **💾 Local Fallback**: Tasks are also saved locally if cloud is unavailable
- **🎨 Glassmorphism**: Modern UI with frosted glass effects
- **💕 Custom Checkboxes**: Heart-themed checkboxes for completing tasks
- **🌈 Floating Hearts**: Animated background elements

## 🚀 Technology Stack

### Frontend

- **HTML5**: Semantic structure
- **CSS3**: Custom styling with CSS variables, animations, and transitions
- **JavaScript (ES6+)**: Dynamic functionality and AWS SDK integration

### Backend/Cloud

- **AWS DynamoDB**: NoSQL database for task storage
- **AWS SDK for JavaScript**: Direct browser-to-DynamoDB communication
- **AWS IAM**: Secure access management

### Optional (for API approach)

- **AWS Lambda**: Serverless functions (Python)
- **AWS API Gateway**: REST API endpoints

## 📋 Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- AWS Account (Free tier is sufficient)
- Basic knowledge of AWS services (optional, setup guide provided)

## 🎯 Quick Start

### 1. Clone or Download

Download the project files to your local machine:

```bash
git clone <your-repo-url>
cd cloud-todo
```

Or simply download the ZIP file and extract it.

### 2. Set Up AWS

Follow the comprehensive setup guide in [`aws/aws-setup-guide.md`](aws/aws-setup-guide.md) to:

1. Create a DynamoDB table
2. Set up IAM user with appropriate permissions
3. Get your AWS credentials

### 3. Open the Application

Simply open `index.html` in your web browser:

```bash
# On Windows
start index.html

# On Mac
open index.html

# On Linux
xdg-open index.html
```

### 4. Configure AWS Credentials

1. Click on "⚙️ AWS Configuration" in the application
2. Enter your AWS credentials:
   - **AWS Region**: e.g., `us-east-1`
   - **Access Key ID**: Your IAM user access key
   - **Secret Access Key**: Your IAM user secret key
   - **DynamoDB Table Name**: `TodoList`
3. Click "💾 Save Configuration"
4. Wait for the success message

### 5. Start Using!

- Add tasks using the input field
- Click checkboxes to mark tasks as complete
- Use filters to view different task categories
- Delete tasks you no longer need

## 📁 Project Structure

```
cloud-todo/
├── index.html              # Main application file
├── styles.css             # All styling and animations
├── app.js                 # JavaScript logic and AWS integration
├── aws/
│   ├── lambda-function.py # Optional Lambda function
│   └── aws-setup-guide.md # Detailed AWS setup instructions
└── README.md              # This file
```

## 🎨 UI Theme

The application features a **girly aesthetic** with:

- 💗 **Colors**: Soft pinks, lavenders, mint, and peach tones
- ✨ **Effects**: Glassmorphism, gradients, shadows
- 🎭 **Animations**: Floating hearts, smooth transitions, hover effects
- 💖 **Custom Elements**: Heart-themed checkboxes, rounded corners
- 🌈 **Gradients**: Multi-color gradient backgrounds

### Color Palette

- Primary Pink: `#FFB6D9`
- Secondary Pink: `#FFC9E0`
- Lavender: `#E5C5F1`
- Light Purple: `#F4E4FF`
- Mint: `#D4F1F4`
- Peach: `#FFE5E5`

## 🔧 Configuration

### AWS Configuration

The application stores AWS credentials in browser's localStorage. For production:

> [!WARNING]
> Never commit AWS credentials to version control. Consider using AWS Cognito for production-grade authentication.

### Environment Variables

For enhanced security, you can modify the app to use environment variables:

```javascript
// Example using environment variables (requires build process)
const AWS_REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
```

## 📊 Features in Detail

### Cloud Synchronization

- Tasks are automatically saved to DynamoDB
- Real-time updates across devices
- Offline support with local storage fallback

### Task Management

- ➕ **Add**: Create new tasks with a single click
- ✅ **Complete**: Mark tasks as done with beautiful animations
- 🗑️ **Delete**: Remove tasks permanently
- 🔍 **Filter**: View all, active, or completed tasks

### Security

- AWS IAM-based authentication
- Credentials stored in browser localStorage
- Option to use AWS Cognito for better security

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add a new task
- [ ] Task appears in the list
- [ ] Task is saved to DynamoDB (check AWS Console)
- [ ] Mark task as complete
- [ ] Completion status updates in DynamoDB
- [ ] Delete a task
- [ ] Task is removed from DynamoDB
- [ ] Test filters (All, Active, Completed)
- [ ] Test on mobile device
- [ ] Test offline functionality

### Verify in AWS Console

1. Go to DynamoDB Console
2. Select `TodoList` table
3. Click "Explore table items"
4. Verify your tasks are stored correctly

## 📱 Responsive Design

The application is fully responsive and works on:

- 💻 Desktop (1920px and above)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

## 🔒 Security Best Practices

1. **Use AWS Cognito** for production applications
2. **Never commit credentials** to Git
3. **Rotate access keys** regularly
4. **Enable MFA** on your AWS account
5. **Use least privilege** IAM policies
6. **Monitor usage** with CloudWatch

## 💰 Cost Estimation

### AWS Free Tier (First 12 months)

- **DynamoDB**: 25 GB storage, 2.5M requests/month - **FREE**
- **Lambda**: 1M requests/month - **FREE** (if using Lambda approach)
- **API Gateway**: 1M calls/month - **FREE** (if using API approach)

For a personal to-do list, you'll likely stay within free tier limits!

## 🚀 Deployment Options

### GitHub Pages

```bash
# Enable GitHub Pages in repository settings
# Your app will be available at: https://username.github.io/repo-name
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Drag and drop the folder in Netlify dashboard
# Or use Netlify CLI
npm install -g netlify-cli
netlify deploy
```

## 🎓 Learning Outcomes

By building this project, you'll learn:

- ✅ AWS DynamoDB operations (CRUD)
- ✅ AWS IAM and security best practices
- ✅ AWS SDK for JavaScript
- ✅ Serverless architecture concepts
- ✅ Frontend integration with cloud services
- ✅ Modern CSS techniques (glassmorphism, animations)
- ✅ Responsive web design
- ✅ Local storage for offline support

## 🐛 Troubleshooting

### Tasks Not Syncing

- Check AWS credentials in configuration
- Verify DynamoDB table exists
- Check browser console for errors
- Ensure IAM permissions are correct

### Connection Failed

- Verify AWS region matches table region
- Check internet connection
- Verify Access Key ID and Secret Key
- Check IAM policy allows DynamoDB access

### CORS Errors (if using Lambda)

- Enable CORS in API Gateway
- Add proper CORS headers in Lambda response
- Clear browser cache

## 📚 Additional Resources

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)

## 🤝 Contributing

Feel free to fork this project and customize it to your needs!

## 📝 License

This project is open source and available for educational purposes.

## 👩‍💻 Author

Created with 💖 as a cloud computing learning project

---

## 🎉 Enjoy Your Cloud To-Do List!

Start organizing your tasks with the power of AWS! ✨

**Made with 💖 using AWS DynamoDB**
