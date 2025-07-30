import React, { useEffect, useState } from "react";
import { Shield, User, Mail, Phone, Calendar } from "lucide-react";
import { getProfile } from "../axios/axios";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const [profile, setProfile] = useState(user);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     const token = localStorage.getItem("token");
  //     const data = await getProfile(token);
  //     console.log("profile", data);
  //     if (data && data.data) setProfile(data.data);
  //   };

  //   fetchProfile();
  // }, []);

  if (!profile) return <div>Loading profile...</div>;
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            View your account information and permissions
          </p>
        </div>

        {profile && (
          <div
            key={profile.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold tracking-tight text-xl text-gray-600">
                    {profile.username}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-rose-600 text-white">
                      {profile.role.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Basic Information
                </h3>
                <div className="grid gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <User className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Username
                      </p>
                      <p className="text-sm">{profile.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Mail className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Email Address
                      </p>
                      <p className="text-sm text-gray-600">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Phone className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Phone Number
                      </p>
                      <p className="text-sm text-gray-600">(Not provided)</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Shield className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Role</p>
                      <p className="text-sm text-gray-600">{profile.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Member Since
                      </p>
                      <p className="text-sm text-gray-600">January 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight text-gray-900">
              Permissions &amp; Access
            </div>
            <div className="text-sm text-muted-foreground text-gray-600">
              Your current role permissions
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-3">
              {[
                "Full system administration access",
                "Manage all books, members, and genres",
                "Delete records and manage staff",
                "Access all reports and analytics",
              ].map((text, idx) => (
                <div key={idx} className="flex items-center text-green-600">
                  <Shield className="mr-2 h-4 w-4" />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
