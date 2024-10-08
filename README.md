# `verify`

Welcome to your new `verify` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `verify`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd verify/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor



///////Certificate Manager
Overview
The Certificate Manager is an actor written in Motoko for managing certificates and transcripts. It provides functionalities for creating, reading, updating, and deleting (CRUD) certificates and transcripts, as well as managing admin accounts. Additionally, it includes features for document verification and admin login.

//////Data Types
Certificate
Represents a certificate with the following fields:

student_id: ID of the student.
name: Name of the student.
program: Program the student completed.
year_of_completion: Year the program was completed.
Transcript
Represents a transcript with the following fields:

student_id: ID of the student.
name: Name of the student.
program: Program the student completed.
year_of_completion: Year the program was completed.
courses: List of courses taken by the student.
Document
A type that can represent either a Certificate or a Transcript.

Admin
Represents an admin with the following fields:

email: Email address of the admin.
password: Password of the admin.
Storage
Certificates are stored with unique codes prefixed by "CERT".
Transcripts are stored with unique codes prefixed by "TRANS".
Admins are stored by their email addresses.
Functions
/////////CRUD for Certificates
createCertificate(student_id: Text, name: Text, program: Text, year_of_completion: Text) : async Text

Creates a new certificate and returns the unique code.
readCertificate(code: Text) : async Result.Result<Certificate, Text>

Reads a certificate by its code.
updateCertificate(code: Text, updatedCertificate: Certificate) : async Result.Result<Text, Text>

Updates an existing certificate.
deleteCertificate(code: Text) : async Result.Result<Text, Text>

Deletes a certificate by its code.
CRUD for Transcripts
createTranscript(student_id: Text, name: Text, program: Text, year_of_completion: Text, courses: [Text]) : async Text

Creates a new transcript and returns the unique code.
readTranscript(code: Text) : async Result.Result<Transcript, Text>

Reads a transcript by its code.
updateTranscript(code: Text, updatedTranscript: Transcript) : async Result.Result<Text, Text>

Updates an existing transcript.
deleteTranscript(code: Text) : async Result.Result<Text, Text>

Deletes a transcript by its code.
CRUD for Admins
createAdmin(email: Text, password: Text) : async Result.Result<Text, Text>

Creates a new admin account.
readAdmin(email: Text) : async Result.Result<Admin, Text>

Reads admin details by email.
updateAdminPassword(email: Text, newPassword: Text) : async Result.Result<Text, Text>

Updates an admin's password.
deleteAdmin(email: Text) : async Result.Result<Text, Text>

Deletes an admin by email.
Verification and Login
verifyDocument(code: Text) : async Result.Result<Document, Text>

Verifies a document by its unique code.
loginAdmin(email: Text, password: Text) : async Result.Result<Text, Text>

Logs in an admin by email and password.
Get All Functions
getAllDocuments() : async [(Text, Document)]

Gets all documents.
getAllAdmins() : async [(Text, Admin)]

Gets all admins.
Upgrade Hooks
preupgrade()

Prepares the system for an upgrade by saving current entries.
postupgrade()

Restores system state after an upgrade.
Private Helper Functions
generateUniqueCode(prefix: Text, code: Nat) : Text
Generates a unique code based on a prefix and a numerical code.
Usage
Creating Documents: Use createCertificate or createTranscript to add new documents.
Reading Documents: Use readCertificate or readTranscript to retrieve documents by code.
Updating Documents: Use updateCertificate or updateTranscript to modify existing documents.
Deleting Documents: Use deleteCertificate or deleteTranscript to remove documents.
Managing Admins: Use createAdmin, readAdmin, updateAdminPassword, and deleteAdmin for admin management.
Verification: Use verifyDocument to verify documents and loginAdmin for admin authentication.
Retrieving Data: Use getAllDocuments and getAllAdmins to list all documents and admins.
Notes
Ensure that the unique codes generated for certificates and transcripts do not conflict.
The system maintains a persistent state across upgrades using hooks.