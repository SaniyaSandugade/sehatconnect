import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import API from "../../services/api";

import HNavbar from "./HNavbar";
import HealthworkerSidebar from "./HealthworkerSidebar";

import "./Stylesheets/HWProfile.css";

const HWProfile = () => {

  const [healthworker, setHealthworker] =
    useState({});

  const [editData, setEditData] =
    useState({});

  const [editMode, setEditMode] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [photoFile, setPhotoFile] =
    useState(null);

  const [password, setPassword] =
    useState("");

  // =========================
  // GET ID
  // =========================

  const stored = JSON.parse(
    localStorage.getItem("hwData")
  );

  const healthworkerId =
    stored?.healthworker?._id;

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchProfile = useCallback(
    async () => {

      try {

        const res = await API.get(
          `/healthworkers/${healthworkerId}`
        );

        setHealthworker(res.data);

        setEditData(res.data);

      } catch (err) {

        console.log(err);

      }

    },
    [healthworkerId]
  );

  useEffect(() => {

    fetchProfile();

  }, [fetchProfile]);

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdate = async () => {

    try {

      const updatedData = {
        ...editData,
      };

      // IMAGE
      if (photoFile) {

        const reader = new FileReader();

        reader.onloadend = async () => {

          updatedData.profilePhoto =
            reader.result;

          saveProfile(updatedData);

        };

        reader.readAsDataURL(photoFile);

      } else {

        saveProfile(updatedData);

      }

    } catch (err) {

      console.log(err);

      alert("Update Failed");

    }

  };

  // =========================
  // SAVE FUNCTION
  // =========================

  const saveProfile = async (
    updatedData
  ) => {

    try {

      if (password) {
        updatedData.password = password;
      }

      const res = await API.put(
        `/healthworkers/${healthworkerId}`,
        updatedData
      );

      const updatedHW = res.data;

      setHealthworker(updatedHW);

      setEditData(updatedHW);

      // UPDATE STORAGE
      localStorage.setItem(
        "hwData",
        JSON.stringify({
          healthworker: updatedHW,
        })
      );

      // REFRESH SIDEBAR
      window.dispatchEvent(
        new Event("storage")
      );

      alert("Profile Updated ✅");

      setEditMode(false);

      setPassword("");

      setPhotoFile(null);

    } catch (err) {

      console.log(err);

      alert("Profile Update Failed");

    }

  };

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {

    setEditData(healthworker);

    setEditMode(false);

    setPassword("");

    setPhotoFile(null);

  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {

    if (
      !window.confirm(
        "Are you sure?"
      )
    )
      return;

    try {

      await API.delete(
        `/healthworkers/${healthworkerId}`
      );

      alert("Profile Deleted");

      localStorage.clear();

      window.location.href =
        "/login";

    } catch (err) {

      console.log(err);

    }

  };

  return (
    <div className="doctor-dashboard">

      <HNavbar />

      <HealthworkerSidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="doctor-body">

        <div className="doctor-main">

          <div className="dp-container">

            <div className="dp-card">

              {/* =========================
                  TOP
              ========================= */}

              <div className="dp-top">

                <img
                  src={
                    photoFile
                      ? URL.createObjectURL(
                          photoFile
                        )
                      : healthworker.profilePhoto ||
                        "https://ui-avatars.com/api/?name=Healthworker"
                  }
                  alt="healthworker"
                  className="dp-image"
                />

                {editMode && (
                  <input
                    type="file"
                    onChange={(e) =>
                      setPhotoFile(
                        e.target.files[0]
                      )
                    }
                  />
                )}

                <h2>
                  {healthworker.fullName}
                </h2>

                <p>
                  Healthworker
                </p>

              </div>

              {/* =========================
                  TABLE
              ========================= */}

              <div className="dp-table">

                {[
                  ["Email", "email"],
                  ["Phone", "phone"],
                  ["Role", "role"],
                  [
                    "City",
                    "domicileCity",
                  ],
                ].map(
                  ([label, key]) => (
                    <div
                      className="dp-row"
                      key={key}
                    >

                      <span>
                        {label}
                      </span>

                      {editMode ? (
                        <input
                          value={
                            editData[
                              key
                            ] || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setEditData({
                              ...editData,
                              [key]:
                                e
                                  .target
                                  .value,
                            })
                          }
                        />
                      ) : (
                        <span>
                          {
                            healthworker[
                              key
                            ]
                          }
                        </span>
                      )}

                    </div>
                  )
                )}

                {/* PASSWORD */}

                {editMode && (
                  <div className="dp-row">

                    <span>
                      Password
                    </span>

                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                    />

                  </div>
                )}

              </div>

              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="dp-actions">

                {editMode ? (
                  <>

                    <button
                      className="btn-save"
                      onClick={
                        handleUpdate
                      }
                    >
                      Save
                    </button>

                    <button
                      className="btn-cancel"
                      onClick={
                        handleCancel
                      }
                    >
                      Cancel
                    </button>

                  </>
                ) : (
                  <>

                    <button
                      className="btn-edit"
                      onClick={() =>
                        setEditMode(
                          true
                        )
                      }
                    >
                      Edit Profile
                    </button>

                    <button
                      className="btn-delete"
                      onClick={
                        handleDelete
                      }
                    >
                      Delete Profile
                    </button>

                  </>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HWProfile;