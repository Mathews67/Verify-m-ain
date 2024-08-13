import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Iter "mo:base/Iter";

actor  {

// Certificate data type
type Certificate = {
student_id: Text;
name: Text;
program: Text;
year_of_completion: Text;
};

// Transcript data type
type Transcript = {
student_id: Text;
name: Text;
program: Text;
year_of_completion: Text;
courses: [Text];
};

// Document type to represent both certificates and transcripts
type Document = {
#Certificate: Certificate;
#Transcript: Transcript;
};

// Admin type with email and password
type Admin = {
email: Text;
password: Text;
};

private stable var nextCertCode: Nat = 1;
private stable var nextTransCode: Nat = 100;
private var documents = HashMap.HashMap<Text, Document>(10, Text.equal, Text.hash);
private var admins = HashMap.HashMap<Text, Admin>(10, Text.equal, Text.hash);

private stable var documentsEntries : [(Text, Document)] = [];
private stable var adminsEntries : [(Text, Admin)] = [];

// ******************** CRUD for Certificates ********************

// Create a new certificate
public func createCertificate(student_id: Text, name: Text, program: Text, year_of_completion: Text) : async Text {
let code = generateUniqueCode("CERT", nextCertCode);
let certificate: Certificate = { student_id; name; program; year_of_completion };
documents.put(code, #Certificate(certificate));
nextCertCode += 1;
code
};

// Read a certificate by code
public query func readCertificate(code: Text) : async Result.Result<Certificate, Text> {
switch (documents.get(code)) {
case (?#Certificate(certificate)) { #ok(certificate) };
case (?#Transcript(_)) { #err("The provided code corresponds to a transcript, not a certificate") };
case (null) { #err("Certificate not found") };
}
};

// Update a certificate by code
public func updateCertificate(code: Text, updatedCertificate: Certificate) : async Result.Result<Text, Text> {
switch (documents.get(code)) {
case (?#Certificate(_)) {
documents.put(code, #Certificate(updatedCertificate));
#ok("Certificate updated successfully");
};
case (?#Transcript(_)) { #err("The provided code corresponds to a transcript, not a certificate") };
case (null) { #err("Certificate not found") };
}
};

// Delete a certificate by code
public func deleteCertificate(code: Text) : async Result.Result<Text, Text> {
switch (documents.remove(code)) {
case (?#Certificate(_)) { #ok("Certificate deleted successfully") };
case (?#Transcript(_)) { #err("The provided code corresponds to a transcript, not a certificate") };
case (null) { #err("Certificate not found") };
}
};

// ******************** CRUD for Transcripts ********************

// Create a new transcript
public func createTranscript(student_id: Text, name: Text, program: Text, year_of_completion: Text, courses: [Text]) : async Text {
let code = generateUniqueCode("TRANS", nextTransCode);
let transcript: Transcript = { student_id; name; program; year_of_completion; courses };
documents.put(code, #Transcript(transcript));
nextTransCode += 1;
code
};

// Read a transcript by code
public query func readTranscript(code: Text) : async Result.Result<Transcript, Text> {
switch (documents.get(code)) {
case (?#Transcript(transcript)) { #ok(transcript) };
case (?#Certificate(_)) { #err("The provided code corresponds to a certificate, not a transcript") };
case (null) { #err("Transcript not found") };
}
};

// Update a transcript by code
public func updateTranscript(code: Text, updatedTranscript: Transcript) : async Result.Result<Text, Text> {
switch (documents.get(code)) {
case (?#Transcript(_)) {
documents.put(code, #Transcript(updatedTranscript));
#ok("Transcript updated successfully");
};
case (?#Certificate(_)) { #err("The provided code corresponds to a certificate, not a transcript") };
case (null) { #err("Transcript not found") };
}
};

// Delete a transcript by code
public func deleteTranscript(code: Text) : async Result.Result<Text, Text> {
switch (documents.remove(code)) {
case (?#Transcript(_)) { #ok("Transcript deleted successfully") };
case (?#Certificate(_)) { #err("The provided code corresponds to a certificate, not a transcript") };
case (null) { #err("Transcript not found") };
}
};

// ******************** CRUD for Admins ********************

// Create a new admin
public func createAdmin(email: Text, password: Text) : async Result.Result<Text, Text> {
switch (admins.get(email)) {
case (null) {
admins.put(email, {email; password});
#ok("Admin account created successfully");
};
case (?_) {
#err("Admin with this email already exists");
};
};
};

// Read admin details by email
public query func readAdmin(email: Text) : async Result.Result<Admin, Text> {
switch (admins.get(email)) {
case (?admin) { #ok(admin) };
case (null) { #err("Admin not found") };
}
};

// Update admin password
public func updateAdminPassword(email: Text, newPassword: Text) : async Result.Result<Text, Text> {
switch (admins.get(email)) {
case (?_) {
admins.put(email, { email; password = newPassword });
#ok("Admin password updated successfully");
};
case (null) { #err("Admin not found") };
}
};

// Delete an admin by email
public func deleteAdmin(email: Text) : async Result.Result<Text, Text> {
switch (admins.remove(email)) {
case (?_) { #ok("Admin deleted successfully") };
case (null) { #err("Admin not found") };
}
};

// ******************** Verification and Login ********************

// Verify a document using its unique code
public query func verifyDocument(code: Text) : async Result.Result<Document, Text> {
switch (documents.get(code)) {
case (null) { #err("Document not found") };
case (?document) { #ok(document) };
}
};

// Admin login
public query func loginAdmin(email: Text, password: Text) : async Result.Result<Text, Text> {
switch (admins.get(email)) {
case (null) { #err("Admin not found"); };
case (?admin) {
if (admin.password == password) {
#ok("Login successful");
} else {
#err("Incorrect password");
};
};
};
};

// ******************** Get All Functions ********************

// Get all documents
public query func getAllDocuments() : async [(Text, Document)] {
Iter.toArray(documents.entries())
};

// Get all admins
public query func getAllAdmins() : async [(Text, Admin)] {
Iter.toArray(admins.entries())
};

// ******************** Upgrade Hooks ********************

system func preupgrade() {
documentsEntries := Iter.toArray(documents.entries());
adminsEntries := Iter.toArray(admins.entries());
};

system func postupgrade() {
documents := HashMap.fromIter<Text, Document>(documentsEntries.vals(), 10, Text.equal, Text.hash);
admins := HashMap.fromIter<Text, Admin>(adminsEntries.vals(), 10, Text.equal, Text.hash);
documentsEntries := [];
adminsEntries := [];
};

// ******************** Private Helper Functions ********************

// Generate unique codes for certificates and transcripts
private func generateUniqueCode(prefix: Text, code: Nat) : Text {
prefix # Nat.toText(code)
};
}
