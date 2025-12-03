import { useState, useEffect } from "react";
import api from "../api/backend";

interface Engineer {
  _id: string;
  name: string;
  age: string;
  sex: string;
  qualification: string;
  phone: string;
  alternateMobile: string;
  email: string;
  passportPhoto: string;
  certificates: string;
  houseAddress: string;
  officeAddress: string;
  nominee: {
    name: string;
    age: string;
    sex: string;
    email: string;
    phone: string;
    bankAccountNumber: string;
    ifscCode: string;
    bankHolderName: string;
  };
  familyMember1?: {
    name: string;
    age: string;
    sex: string;
    email: string;
    mobile: string;
    address: string;
  };
  familyMember2?: {
    name: string;
    age: string;
    sex: string;
    email: string;
    mobile: string;
    address: string;
  };
}

export default function Profile() {
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{
    passportPhoto: File | null;
    certificates: File | null;
  }>({
    passportPhoto: null,
    certificates: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first");
          return;
        }

        // Get user ID from token payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        if (!userId) {
          setError("Invalid user session");
          return;
        }

        // Use the specific engineer endpoint
        const data = await api.engineers.get(userId);
        setEngineer(data);

        // Store userId for future use
        localStorage.setItem("userId", userId);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!engineer) return;
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (files.passportPhoto) {
        formData.append("passportPhoto", files.passportPhoto);
      }
      if (files.certificates) {
        formData.append("certificates", files.certificates);
      }

      // Get all the form data
      const form = e.target as HTMLFormElement;
      const formElements = form.elements as any;

      const fields = [
        "name",
        "age",
        "sex",
        "qualification",
        "phone",
        "alternateMobile",
        "email",
        "houseAddress",
        "officeAddress",
      ];

      fields.forEach((field) => {
        if (formElements[field]) {
          formData.append(field, formElements[field].value);
        }
      });

      // Get all nominee details
      const nomineeBankAccount = formElements.nomineeBankAccount.value;
      const nomineeBankAccountConfirm =
        formElements.nomineeBankAccountConfirm.value;
      const nomineeIFSC = formElements.nomineeIFSC.value;
      const nomineeBankHolder = formElements.nomineeBankHolder.value;

      // Always validate bank details
      if (!nomineeBankAccount || !nomineeIFSC || !nomineeBankHolder) {
        setError(
          "Nominee bank details are required. Please fill in all bank fields."
        );
        return;
      }

      // Validate bank account confirmation
      if (nomineeBankAccount !== nomineeBankAccountConfirm) {
        setError(
          "Bank account numbers do not match. Please verify and try again."
        );
        return;
      }

      // Create nominee object with all details
      const nominee = {
        name: formElements.nomineeName.value || engineer.nominee?.name,
        age: formElements.nomineeAge.value || engineer.nominee?.age,
        sex: formElements.nomineeSex.value || engineer.nominee?.sex,
        email: formElements.nomineeEmail.value || engineer.nominee?.email,
        phone: formElements.nomineePhone.value || engineer.nominee?.phone,
        bankAccountNumber: nomineeBankAccount,
        confirmBankAccountNumber: nomineeBankAccountConfirm, // This will be removed by backend
        ifscCode: nomineeIFSC,
        bankHolderName: nomineeBankHolder,
      };

      formData.append("nominee", JSON.stringify(nominee));

      await api.engineers.updateProfile(engineer._id, formData);
      // Refresh the data after successful update
      const updatedData = await api.engineers.get(engineer._id);
      setEngineer(updatedData);
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setError(""); // Clear any existing errors
      setIsEditing(false); // Exit edit mode
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!engineer)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No profile data found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{engineer.name}</span>!
              👷
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage your profile information
            </p>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={engineer.name}
                    className={`mt-1 block w-full rounded-lg shadow-sm p-2 ${
                      isEditing
                        ? "border border-gray-300 bg-white"
                        : "border-none bg-gray-50"
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={engineer.email}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={engineer.phone}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="alternateMobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Alternate Mobile
                  </label>
                  <input
                    type="tel"
                    id="alternateMobile"
                    name="alternateMobile"
                    defaultValue={engineer.alternateMobile}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    defaultValue={engineer.age}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sex"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sex
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    defaultValue={engineer.sex}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Passport Photo
                  </label>
                  {engineer.passportPhoto && (
                    <img
                      src={engineer.passportPhoto}
                      alt="Passport"
                      className="mt-2 h-32 w-32 object-cover rounded-lg"
                    />
                  )}
                  {isEditing && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Update Passport Photo
                      </label>
                      <input
                        type="file"
                        name="passportPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Certificates
                  </label>
                  {engineer.certificates && (
                    <a
                      href={engineer.certificates}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-blue-600 hover:underline"
                    >
                      View Current Certificates
                    </a>
                  )}
                  {isEditing && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Update Certificates
                      </label>
                      <input
                        type="file"
                        name="certificates"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="houseAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    House Address
                  </label>
                  <textarea
                    id="houseAddress"
                    name="houseAddress"
                    rows={3}
                    defaultValue={engineer.houseAddress}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="officeAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Office Address
                  </label>
                  <textarea
                    id="officeAddress"
                    name="officeAddress"
                    rows={3}
                    defaultValue={engineer.officeAddress}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Nominee Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Nominee Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nomineeName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="nomineeName"
                    name="nomineeName"
                    defaultValue={engineer.nominee?.name}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineeAge"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>
                  <input
                    type="number"
                    id="nomineeAge"
                    name="nomineeAge"
                    defaultValue={engineer.nominee?.age}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineeSex"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sex
                  </label>
                  <select
                    id="nomineeSex"
                    name="nomineeSex"
                    defaultValue={engineer.nominee?.sex}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="nomineeEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="nomineeEmail"
                    name="nomineeEmail"
                    defaultValue={engineer.nominee?.email}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineePhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="nomineePhone"
                    name="nomineePhone"
                    defaultValue={engineer.nominee?.phone}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineeBankAccount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bank Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomineeBankAccount"
                    name="nomineeBankAccount"
                    defaultValue={engineer.nominee?.bankAccountNumber}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineeBankAccountConfirm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Bank Account Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomineeBankAccountConfirm"
                    name="nomineeBankAccountConfirm"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineeIFSC"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomineeIFSC"
                    name="nomineeIFSC"
                    defaultValue={engineer.nominee?.ifscCode}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label
                    htmlFor="nomineeBankHolder"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bank Account Holder Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nomineeBankHolder"
                    name="nomineeBankHolder"
                    defaultValue={engineer.nominee?.bankHolderName}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              {isEditing && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Profile</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
