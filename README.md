# 🔬 Privacy Microscope  
### **See What Websites Track About You!**  

**Privacy Microscope** is a browser extension that exposes tracking headers sent when you visit websites. Unlike traditional blockers, it doesn't prevent tracking—it lets you **see it happening in real-time** so you can better understand online tracking.

## 🚀 Features
✅ Logs tracking headers (`User-Agent`, `Referer`, `Cookie`)  
✅ Reveals **which websites** receive tracking data  
✅ Provides **real-time logs** in an easy-to-read popup  
✅ Works in **Microsoft Edge**  

## 🔍 How It Works
1. Captures outgoing request headers using `chrome.webRequest.onBeforeSendHeaders`.  
2. Extracts **tracking-related headers** and logs them in the extension popup.  
3. Shows **which domains receive tracking data**.  

## 🛠️ Installation
1. **Clone the repo**  
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/Privacy-Microscope.git
   cd Privacy-Microscope
Load it into Edge (Developer Mode)
Open edge://extensions/
Turn on Developer Mode
Click "Load Unpacked"
Select the Privacy-Microscope folder
🏗️ Future Improvements
🔹 Filtering options to focus on specific tracking types
🔹 Tracking summary reports over time
🔹 Exploring anonymization techniques to demonstrate differential privacy

🤝 Contribute
Got ideas? Open an issue or submit a pull request!

📜 License
This project is open-source under the MIT License.
