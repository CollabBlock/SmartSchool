
# SmartSchool

## Overview
SmartSchool is a comprehensive mobile application designed to streamline school management operations. Developed using React Native and Firebase, SmartSchool provides a robust platform for managing students, teachers, classes, fees, and academic schedules efficiently.

<img width="389" alt="image" src="https://github.com/CollabBlock/SmartSchool/assets/91197082/98b86011-530e-422f-973d-3e5ca133cdb8">


## Features
- **User Authentication**: Secure login for Admin, Teacher, and Student roles using Firebase Authentication.
- **Student Management**: Admin can add, view, update, and delete student records, including registration details, personal information, and academic data.
- **Teacher Management**: Admin can assign and reassign classes to teachers, and manage teacher records.
- **Class Management**: Admin can upload and remove timetables and syllabi, and view class schedules.
- **Fee Management**: Admin can manage fee records, including the amount due, amount paid, and payment dates.
- **Real-Time Updates**: Utilizes Firestore for real-time data synchronization across all users.
- **Interactive Dashboards**: Visualize data through interactive charts and graphs to enhance decision-making.

## Technology Stack
- **Frontend**: React Native
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage

## Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/CollabBlock/SmartSchool.git
    cd SmartSchool
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup Firebase**:
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Add your app to the Firebase project.
    - Download the `google-services.json` file for Android and `GoogleService-Info.plist` file for iOS and place them in the appropriate directories.

4. **Link dependencies** (if not using auto-linking):
    ```bash
    npx react-native link
    ```

5. **Run the app**:
    - For Android:
        ```bash
        npx react-native run-android
        ```
    - For iOS:
        ```bash
        cd ios
        pod install
        cd ..
        npx react-native run-ios
        ```

## Usage
1. **Admin Login**: Use the provided admin credentials to login and manage school operations.
2. **Teacher and Student Login**: Use the credentials assigned by the admin to access specific functionalities.

## Screenshots
<img width="393" alt="image" src="https://github.com/CollabBlock/SmartSchool/assets/91197082/ad7d8320-aa80-41b3-ab5b-dbda8f34a24e">

<img width="390" alt="image" src="https://github.com/CollabBlock/SmartSchool/assets/91197082/8ec4c213-479f-43b5-a16c-fa3d11c904c2">

<img width="390" alt="image" src="https://github.com/CollabBlock/SmartSchool/assets/91197082/8da00e53-c9d0-4ccd-b276-1b489b5ae588">




## Contributing
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or support, please contact [your-email@example.com](mailto:your-email@example.com).

---

This `README.md` provides a comprehensive overview of the SmartSchool project, including features, installation steps, usage, and contact information. Adjust the paths and links to match your project structure and repository.
