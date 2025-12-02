import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { startButtonLoading, stopButtonLoading } from "../../../store/buttonLoaderSlice";
import { Checkbox } from "@mui/material";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const NewRegistrationScreen = () => {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: null,
    state_id: '',
    city_id: '',
    acceptedTerms: false,
  });

  const [clientData, setClientData] = useState();
  const { isButtonLoading } = useSelector((state) => state.buttonLoader)
  const dispatch = useDispatch()
  const router = useRouter();

  // ✅ Fetch States from API on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const { data } = await axios.get(Baseurl + "/db/admin/state/available?country_id=101");

        // Adjust based on your API response structure
        setStates(data?.data || data);
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Failed to load states", { autoClose: 2500 });
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // ✅ Handle State change and fetch cities
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setFormFields({ ...formFields, state_id: stateId, city_id: '' });

    if (!stateId) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    try {
      const { data } = await axios.get(Baseurl + `/db/admin/city/by-state?state_id=${stateId}`);

      // Adjust based on your API response structure
      setCities(data?.data || data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities", { autoClose: 2500 });
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }

  // ✅ Handle city change
  const handleCityChange = (e) => {
    setFormFields({ ...formFields, city_id: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { first_name, last_name, email, contact, state_id, city_id } = formFields;

    if (!formFields?.acceptedTerms) {
      dispatch(stopButtonLoading());
      toast.warning("Please select the checkbox", { autoClose: 2500 });
      return;
    }

    if (!first_name || !last_name || !email || !contact || !state_id || !city_id) {
      dispatch(stopButtonLoading());
      return toast.warning("Please fill all mandatory fields", { autoClose: 2500 });
    }

    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
      dispatch(stopButtonLoading());
      return toast.warning("Contact number must be a 10-digit number", { autoClose: 2500 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(stopButtonLoading());
      return toast.warning("Please enter a valid email address", { autoClose: 2500 });
    }

    let newFormfields = { ...formFields, db_name: clientData?.db_name }
    console.log(newFormfields)

    try {
      dispatch(startButtonLoading());
      const { data } = await axios.post(
        Baseurl + `/db/channelPartnerLeads`,
        newFormfields
      );

      if (data.status === 200) {
        dispatch(stopButtonLoading());
        toast.success(data?.message, { autoClose: 2500 });
        setTimeout(() => {
          router.push("/partner");
        }, 2500);
      }
    } catch (error) {
      dispatch(stopButtonLoading());
      console.log(error?.response?.data);
      const errorMessage = error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { autoClose: 2500 });
    }
  };

  useEffect(() => {
    const getSignInData = async () => {
      try {
        let baseUrl = window.location.origin;
        if (baseUrl === "http://localhost:3000") {
          baseUrl = "https://kissan.saleofast.com"
        }
        const { data } = await axios.post(Baseurl + "/db/admin/url", {
          client_url: `${baseUrl}`,
        })
        console.log("client url", data)
        setClientData(data?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getSignInData()
  }, [])

  return (
    <>
      <section className="Sign-Up pt-4" style={{ padding: '0 16px' }}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-7">
              <div className="row gx-3">
                <div className="Sign-In-logo pb-4">
                  <img src={
                    clientData?.logo
                      ? `${filesUrl}/logo/images${clientData?.logo}`
                      : "/ChannelPartner/logo.png"
                  } alt="normal" />
                </div>
                <div className="col-6">
                  <div
                    style={{
                      height: 290,
                      width: "100%",
                      backgroundImage: clientData?.client_image_1 ? `url(${filesUrl}/clientdoc/images${clientData?.client_image_1})` : `url(/ChannelPartner/signup-img1.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderTopLeftRadius: 10,
                    }}
                  ></div>
                  <div
                    style={{
                      height: 200,
                      width: "100%",
                      backgroundImage: clientData?.client_image_2 ? `url(${filesUrl}/clientdoc/images${clientData?.client_image_2})` : `url(/ChannelPartner/signup-img3.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderBottomLeftRadius: 10,
                    }}
                  ></div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      height: 200,
                      width: "100%",
                      backgroundImage: clientData?.client_image_3 ? `url(${filesUrl}/clientdoc/images${clientData?.client_image_3})` : `url(/ChannelPartner/signup-img2.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderTopRightRadius: 10,
                    }}
                  ></div>
                  <div
                    style={{
                      height: 290,
                      width: "100%",
                      backgroundImage: clientData?.client_image_4 ? `url(${filesUrl}/clientdoc/images${clientData?.client_image_4})` : `url(/ChannelPartner/signup-img4.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderBottomRightRadius: 10,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 d-flex justify-content-center">
              <div className="Sign-Up_Sign-In">
                <h3 className="Perfect-Home ps-2">Find Your Perfect Home. </h3>
                <div className="underline" />
                <div className="d-flex pt-5 ps-2">
                  <div
                    className="nav-link d-flex flex-column gap-2 align-items-center pb-3 Sign-Up-btn text-white"
                    id="Sign-Up"
                    data-bs-toggle="tab"
                    data-bs-target="#Sign-Up-tab"
                    style={{ backgroundColor: `${clientData?.button_color || '#293790'}` }}
                  >
                    Registration
                  </div>
                </div>
                <div className="perfect-home-form pt-1">
                  <section className="Details_Form">
                    <div className="container pt-3">
                      <form
                        id="survey-form"
                        method="GET"
                        action
                        className="d-flex flex-column gap-3"
                        onSubmit={handleSubmit}
                      >
                        <div className="d-flex gap-2">
                          <div className="rowTab">
                            <div className="labels">
                              <label id="name-label" htmlFor="first_name">
                                First Name
                              </label>
                              <span>*</span>
                            </div>
                            <div className="rightTab">
                              <input
                                autoFocus
                                type="text"
                                name="first_name"
                                id="first_name"
                                className="input-field"
                                placeholder="Enter First Name"
                                value={formFields?.first_name}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const formattedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                                  setFormFields({ ...formFields, first_name: formattedValue });
                                }}
                              />
                            </div>
                          </div>
                          <div className="rowTab">
                            <div className="labels">
                              <label id="name-label" htmlFor="last_name">Last Name</label>
                              <span>*</span>
                            </div>
                            <div className="rightTab">
                              <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                className="input-field"
                                placeholder="Enter Last Name"
                                value={formFields?.last_name}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const formattedValue = value.replace(/[^a-zA-Z]/g, '');
                                  setFormFields({ ...formFields, last_name: formattedValue });
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* State Dropdown */}
                        <div className="rowTab">
                          <div className="labels">
                            <label id="number" htmlFor="State">
                              State
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <select
                              className="input-field"
                              style={{ height: '40px', border: '1px solid gray' }}
                              onChange={handleStateChange}
                              value={formFields.state_id}
                              disabled={loadingStates}
                            >
                              <option value="">
                                {loadingStates ? "Loading states..." : "Select State"}
                              </option>
                              {states.map((st) => (
                                <option key={st.state_id} value={st.state_id}>
                                  {st.state_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* City Dropdown */}
                        <div className="gap-2">
                          <div className="rowTab">
                            <div className="labels">
                              <label id="state-label" htmlFor="District">
                                District/City
                              </label>
                              <span>*</span>
                            </div>
                            <div className="rightTab">
                              <select
                                className="input-field"
                                style={{ height: '40px', border: '1px solid gray' }}
                                onChange={handleCityChange}
                                value={formFields.city_id}
                                disabled={loadingCities || !formFields.state_id}
                              >
                                <option value="">
                                  {loadingCities ? "Loading cities..." : "Select District/City"}
                                </option>
                                {cities.map((city) => (
                                  <option key={city.city_id} value={city.city_id}>
                                    {city.city_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="rowTab">
                          <div className="labels">
                            <label id="number" htmlFor="contact">
                              Contact
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <input
                              type="text"
                              name="contact"
                              id="contact"
                              className="input-field"
                              placeholder="Enter Contact Number"
                              value={formFields?.contact}
                              onChange={(e) => {
                                const value = e.target.value;
                                const formattedValue = value.replace(/\D/g, '').slice(0, 10);
                                setFormFields({ ...formFields, contact: formattedValue });
                              }}
                            />
                          </div>
                        </div>

                        <div className="rowTab">
                          <div className="labels">
                            <label id="email-label" htmlFor="email">
                              Email
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="input-field"
                              placeholder="Enter Email"
                              value={formFields?.email}
                              onChange={(e) => {
                                setFormFields({ ...formFields, email: e.target.value })
                              }}
                            />
                          </div>
                        </div>

                        <div className="rowTab">
                          <div className="labels"></div>
                          <div className="rightTab">
                            <label htmlFor="terms" style={{ margin: 0 }}>
                              <Checkbox
                                {...label}
                                type="checkbox"
                                checked={formFields.acceptedTerms}
                                onChange={(e) => setFormFields({ ...formFields, acceptedTerms: e.target.checked })}
                              />
                              I agree to the{" "}
                              <a
                                href="/terms-and-conditions"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "blue", textDecoration: "underline" }}
                              >
                                Terms & Conditions
                              </a>
                            </label>
                          </div>
                        </div>

                        <button
                          id="craete-account"
                          type="submit"
                          className="border-0 mb-4"
                          disabled={isButtonLoading}
                        >
                          {isButtonLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              &nbsp;Submit
                            </>
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </form>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewRegistrationScreen;