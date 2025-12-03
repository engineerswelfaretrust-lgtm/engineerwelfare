import { useState, useEffect } from "react";
import api from "../api/backend";

interface Nominee {
  name: string;
  age: string;
  sex: string;
  email: string;
  phone: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankHolderName: string;
}

interface Engineer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  status: string;
  deceasedDate: string;
  deceasedReason: string;
  deceasedDisease: string;
  passportPhoto: string;
  nominee: Nominee;
}

export default function Deceased() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeceasedEngineers = async () => {
      try {
        const data = await api.engineers.list("deceased");
        setEngineers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load deceased engineers");
      } finally {
        setLoading(false);
      }
    };

    fetchDeceasedEngineers();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">
            Deceased Engineers
          </h1>
          <p className="mt-2 text-gray-600">
            List of engineers who have passed away
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {engineers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No deceased engineers found
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {engineers.map((engineer) => (
                <li key={engineer._id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 h-12 w-12">
                      {engineer.passportPhoto ? (
                        <img
                          src={engineer.passportPhoto}
                          alt={engineer.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {engineer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {engineer.name}
                        </h2>
                        <span className="text-sm text-gray-500">
                          {new Date(engineer.deceasedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {engineer.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Phone:</span>{" "}
                            {engineer.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Qualification:</span>{" "}
                            {engineer.qualification}
                          </p>
                          {engineer.deceasedDisease && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Disease:</span>{" "}
                              {engineer.deceasedDisease}
                            </p>
                          )}
                          {engineer.deceasedReason && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Reason:</span>{" "}
                              {engineer.deceasedReason}
                            </p>
                          )}
                        </div>

                        {engineer.nominee && (
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Nominee Details
                            </h3>
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                    >
                                      Contact
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                    >
                                      Account Details
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                    >
                                      IFSC Code
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      <div>
                                        <p className="font-medium">
                                          {engineer.nominee.name}
                                        </p>
                                        <p className="text-gray-500">
                                          {engineer.nominee.age} years,{" "}
                                          {engineer.nominee.sex}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                      <div>
                                        <p>{engineer.nominee.email}</p>
                                        <p>{engineer.nominee.phone}</p>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <div>
                                        <p className="font-medium">
                                          {engineer.nominee.bankHolderName}
                                        </p>
                                        <p className="text-gray-500">
                                          AC:{" "}
                                          {engineer.nominee.bankAccountNumber}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-mono">
                                      {engineer.nominee.ifscCode}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
