#BhagwatGeeta: A Node.js and Express-based Application<br>
✨ Project Showcase ✨<br>
<br>
BhagwatGeeta is a platform that brings the timeless wisdom of the Bhagwat Geeta online, with an English translation. This Node.js and Express-based application allows users to read, interact with, and explore spiritual teachings, while fostering a collaborative community.<br>
<br>
Key Features<br>
📖 Read Bhagwat Geeta Online: Access all chapters and slokas (verses) with their detailed explanations, anytime, anywhere.<br>
💬 Community Engagement: Users can comment on specific slokas, sharing interpretations, and exploring diverse perspectives.<br>
📩 Daily Email Quotes: Receive an inspiring quote from the Bhagwat Geeta in your inbox daily to encourage reflection and learning.<br>
🔒 Secure Authentication: JWT-based authentication ensures safe user login and access control.<br>
💾 CRUD Operations: Users can create, read, update, and delete their accounts and comments with ease.<br>
<br>
Technologies & Tools
Frontend: JavaScript (DOM manipulation for dynamic UI).<br>
Backend: Node.js and Express for server-side logic.<br>
Database: MongoDB for managing user data, sloka comments, and other user-related information.<br>
Email Service: Nodemailer to deliver daily quotes to users.<br>
File Handling: Multer for handling file uploads (if applicable).<br>
Scheduling: Node-Cron to automate daily email delivery.<br>
<br>
<br>
Entities:<br>
User<br>
<br>
Represents the users of the platform.<br>
Attributes: userId, name, email, password, createdAt, updatedAt.<br>
Sloka (Verse)<br>
<br>
Represents each verse of the Bhagwat Geeta.<br>
Attributes: slokaId, chapter, verseNumber, slokaText, explanation.<br>
Comment<br>
<br>
Represents user comments on specific slokas.<br>
Attributes: commentId, userId (reference to User), slokaId (reference to Sloka), commentText, createdAt, updatedAt.<br>
DailyQuote<br>
<br>
Represents the daily email quote that is sent to users.<br>
Attributes: quoteId, quoteText, createdAt.<br>
Relationships:<br>
A User can have many Comments (one-to-many relationship).<br>
A Sloka can have many Comments (one-to-many relationship).<br>
A User can receive many DailyQuotes (one-to-many relationship).<br>
<br>
ER Diagram (Entity-Relationship Diagram)<br>
The relationships can be visualized as follows:<br>
<br>
User has a many-to-many relationship with Sloka via Comment.<br>
Sloka has a many-to-many relationship with User via Comment.<br>
<br>
![image](https://github.com/user-attachments/assets/fa9f9da3-9355-41a2-94c8-6de3c6aa8ceb)<br>
<br>
<br>
Explanation:<br>
The User table has a reference to Comment via the userId field.<br>
The Sloka table has a reference to Comment via the slokaId field.<br>
A User can have multiple Comments and can receive many DailyQuotes.<br>
Each Sloka can have multiple comments by various users.<br>
DailyQuote is independent and is sent to multiple users based on the schedule.<br>
