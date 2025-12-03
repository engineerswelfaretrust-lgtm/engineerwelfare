import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/backend";
import { useAuth } from "../context/AuthContext";

interface Engineer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  status: string;
  passportPhoto: string;
  certificates: string;
  createdAt: string;
}

export default function Admin() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(
    null
  );
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "deceased"
  >("all");
  const [approvalData, setApprovalData] = useState({
    disease: "",
    message: "",
  });
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
  }, [isAdmin, navigate]);

  const fetchEngineers = async () => {
    try {
      const data = await api.engineers.list(
        filter !== "all" ? filter : undefined
      );
      setEngineers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load engineers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, []);

  const handleApprove = async (engineerId: string) => {
    try {
      if (!approvalData.disease) {
        alert("Please enter disease name");
        return;
      }
      await api.engineers.approve(engineerId, {
        disease: approvalData.disease,
        message: approvalData.message,
      });
      // Refresh the list
      fetchEngineers();
      setSelectedEngineer(null);
      setApprovalData({ disease: "", message: "" });
    } catch (err: any) {
      alert(err.message || "Failed to approve engineer");
    }
  };

  const handleMarkDeceased = async (
    engineerId: string,
    data: { reason?: string; diseaseName?: string }
  ) => {
    try {
      await api.engineers.deceased(engineerId, data);
      // Refresh the list
      fetchEngineers();
    } catch (err: any) {
      alert(err.message || "Failed to mark engineer as deceased");
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage engineer approvals and registrations
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filter Engineers
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as typeof filter);
              fetchEngineers();
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Engineers</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="deceased">Deceased</option>
          </select>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {engineers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No pending approvals
              </div>
            ) : (
              engineers.map((engineer) => (
                <div key={engineer._id} className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      {engineer.passportPhoto ? (
                        <img
                          src={engineer.passportPhoto}
                          alt={engineer.name}
                          className="h-16 w-16 sm:h-24 sm:w-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-2xl text-gray-500">
                            {engineer.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {engineer.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Registered on{" "}
                            {new Date(engineer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            engineer.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : engineer.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {engineer.status.charAt(0).toUpperCase() +
                            engineer.status.slice(1)}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {engineer.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {engineer.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Qualification</p>
                          <p className="text-sm font-medium text-gray-900">
                            {engineer.qualification}
                          </p>
                        </div>
                        {engineer.certificates && (
                          <div>
                            <p className="text-sm text-gray-500">
                              Certificates
                            </p>
                            <a
                              href={engineer.certificates}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Certificates
                            </a>
                          </div>
                        )}
                      </div>

                      {selectedEngineer?._id === engineer._id ? (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg w-full">
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="disease"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Disease Name *
                              </label>
                              <input
                                type="text"
                                id="disease"
                                value={approvalData.disease}
                                onChange={(e) =>
                                  setApprovalData((prev) => ({
                                    ...prev,
                                    disease: e.target.value,
                                  }))
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Approval Message (Optional)
                              </label>
                              <textarea
                                id="message"
                                value={approvalData.message}
                                onChange={(e) =>
                                  setApprovalData((prev) => ({
                                    ...prev,
                                    message: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                              <button
                                onClick={() => setSelectedEngineer(null)}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleApprove(engineer._id)}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                              >
                                Confirm Approval
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full">
                          <button
                            onClick={() => setSelectedEngineer(engineer)}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Approve Engineer
                          </button>
                          <button
                            onClick={() => {
                              const reason = window.prompt(
                                "Enter reason for marking as deceased (optional):"
                              );
                              const disease = window.prompt(
                                "Enter disease name (optional):"
                              );
                              if (reason !== null || disease !== null) {
                                handleMarkDeceased(engineer._id, {
                                  reason: reason || undefined,
                                  diseaseName: disease || undefined,
                                });
                              }
                            }}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                          >
                            Mark as Deceased
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
