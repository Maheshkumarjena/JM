"use client";

// ! Pending Work:

// * Item history upload.
// * MRP field value should modify whenever user edits the mrp field.

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import xlsx from "json-as-xlsx";
import { useState, useEffect } from "react";
import Select, { createFilter } from "react-select";
import gstAmount from "../DB/Purchase/gstamount";
import gstType from "../DB/Purchase/gsttype";
import {
  InclusiveCalc,
  ExclusiveCalc,
  ExemptCalc,
  TotalAmountCalc,
  exclusiveDM,
} from "../Disc/disc";
import Image from "next/image";
import CustomOption from "../Dropdown/CustomOption";
import CustomMenuList from "../Dropdown/CustomMenuList";
import { useRouter, useSearchParams } from "next/navigation";
import purchasetype from "../DB/Purchase/purchasetype";

export default function page(props) {
  const searchParams = useSearchParams();
  // * Use Effects

  useEffect(() => {
    getExcelData();
    checkNotDownload(searchParams.get("fromNewItem"));
    retrieveDataFromNewItem(searchParams.get("fromNewItem")); // * Retrieve data from the new item page.
  }, []);

  // * useStates for storing data.

  const [loadingExcel, setLoadingExcel] = useState(true); // * false for dev purpose
  const [excelContent, setExcelContent] = useState([]);
  const [partyData, setPartyData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [formData, setFormData] = useState({
    partyName: null,
    invoiceNo: null,
    invoiceDate: new Date(), // default date is today
    gstType: null,
    unit: "Pcs", // default value
    purchaseType: "DNM",
    mDiscPercentage: 0, // mention discount percentage
    itemPartNo: null,
    itemLocation: null, // from item data
    quantity: null,
    mrp: null,
    gstPercentage: null,
    amount: null,
    finalDisc: "ERROR!",
  });
  const [modalMessage, setModalMessage] = useState({
    title: "",
    message: "",
    button: "",
  });

  const [modalConfirmation, setModalConfirmation] = useState({
    title: "",
    message: "",
    button_1: "",
    button_2: "",
    messages: [],
    btn_f_1: () => {},
    btn_f_2: () => {},
  });

  // * handle the modal

  const handleModal = (title, message, button) => {
    setModalMessage({ title, message, button });
  };

  const handleConfirmationModal = (
    title,
    message,
    button_1,
    button_2,
    messages,
    f1,
    f2
  ) => {
    setModalConfirmation({
      title,
      message,
      button_1,
      button_2,
      messages,
      btn_f_1: f1,
      btn_f_2: f2,
    });
  };

  // * handle the changes of formData

  const handleFormChange = (event) => {
    console.log(event.target?.name, event.target?.value);
    const name = event.target?.name;
    const value = event.target?.value;
    setFormData((values) => ({ ...values, [name]: value }));
  };

  // * router for navigation

  const router = useRouter();

  // * Load our excel document for Party & Item Data.

  const getExcelData = async () => {
    // * Check if data is already saved in localStorage

    checkLocalStorageSaved("PARTY_API_DATA", setPartyData);
    checkLocalStorageSaved("ITEM_API_DATA", setItemData);

    Promise.all([
      fetch(
        "https://script.google.com/macros/s/AKfycbx3G0up1xJoNIJqXLRdmSLQ09OPtwKnTfi8uWPzEw-vCUT4nwvluEmwOA3CKinO6PJhPg/exec"
      ),
      fetch(
        "https://script.google.com/macros/s/AKfycbwr8ndVgq8gTbhOCRZChJT8xEOZZCOrjev29Uk6DCDLQksysu80oTb8VSnoZMsCQa3g/exec"
      ),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        // data[0] contains the items
        // data[1] contains the party

        const item_data = data[0];
        const party_data = data[1];

        // localStorage.setItem("")

        setItemData(item_data);
        setPartyData(party_data);

        setLoadingExcel(false);

        localStorage.setItem("PARTY_API_DATA", JSON.stringify(party_data));
        localStorage.setItem("ITEM_API_DATA", JSON.stringify(item_data));
      })
      .catch((error) => {
        setLoadingExcel(true);
        console.error(error);
      });
  };

  // * localStorage for storing data

  const checkLocalStorageSaved = (address, manager) => {
    let storage = localStorage.getItem(address); // * address is the key
    if (storage !== null && storage != undefined) {
      storage = JSON.parse(storage);
      manager(storage); // * manager is the setter function
    }
  };

  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key) => {
    const storage = localStorage.getItem(key);
    if (storage !== null && storage !== undefined) {
      return JSON.parse(storage);
    } else {
      return null;
    }
  };

  const getLocalStorageString = (key) => {
    const storage = localStorage.getItem(key);
    if (storage !== null || storage !== undefined) return storage;
    return null;
  };

  const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
  };

  const storeNotDownload = (obj) => {
    const retrievedArray = getLocalStorage("PURCHASE_NOT_DOWNLOAD_DATA") || [];
    retrievedArray.push(obj);
    setLocalStorage("PURCHASE_NOT_DOWNLOAD_DATA", retrievedArray);
  };

  const checkNotDownload = (searchBar) => {
    const retrievedArray = getLocalStorage("PURCHASE_NOT_DOWNLOAD_DATA");
    const agreed = () => {
      if (retrievedArray !== null && retrievedArray !== undefined) {
        setExcelContent(retrievedArray);
        const constantFields = retrievedArray[0];
        console.log(constantFields);
        let dateString = constantFields?.billDate || "26-08-2003";
        let dateParts = dateString.split("-");
        let dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        handleFormChange({
          target: {
            name: "invoiceNo",
            value: constantFields?.invoiceNo,
          },
        });
        handleFormChange({
          target: {
            name: "partyName",
            value: constantFields?.partyName,
          },
        });
        handleFormChange({
          target: {
            name: "invoiceDate",
            value: dateObject,
          },
        });
      }
    };

    if (searchBar === "true") {
      agreed();
      return;
    }

    handleConfirmationModal(
      "Confirmation ❓",
      "Do you want to load the previous unsaved data?",
      "Yes",
      "No",
      [
        {
          data: `📜 Invoice: ${retrievedArray?.[0]?.invoiceNo}`,
          style: "text-xl font-bold",
        },
        {
          data: `🤵 Party: ${retrievedArray?.[0]?.partyName}`,
          style: "text-sm",
        },
        {
          data: `📑 Total: ${retrievedArray?.length} items`,
          style: "text-sm",
        },
        {
          data: `📅 Date: ${retrievedArray?.[0]?.billDate}`,
          style: "text-sm",
        },
      ],

      agreed,
      () => clearLocalStorage("PURCHASE_NOT_DOWNLOAD_DATA")
    );
    retrievedArray && window.purchase_modal_2.showModal();
  };

  // * This function used for get & set the data from new item addition page.

  const retrieveDataFromNewItem = (searchBar) => {
    // ? These will be the values from the new item page.

    const retrievedArray =
      JSON.parse(localStorage.getItem("US_ADDED_ITEMS")) || [];

    if (searchBar === "true" && retrievedArray?.length > 0) {
      console.log("RETRIEVED ARRAY: ", retrievedArray);

      const loc = retrievedArray?.[0]?.Loc?.toUpperCase();
      const mrp = retrievedArray?.[0]?.MRP;
      const gst = retrievedArray?.[0]?.Tax_Category;
      const item = retrievedArray?.[0]?.Item_Name?.toUpperCase();
      const party = getLocalStorageString("US_PN_REFERER")?.toUpperCase();
      const invoice = getLocalStorageString("US_INV_REFERER")?.toUpperCase();
      const credit = 0;

      console.log(party, invoice);

      handleFormChange({
        target: { name: "itemLocation", value: loc },
      });

      handleFormChange({
        target: { name: "mrp", value: mrp },
      });

      handleFormChange({
        target: { name: "gstPercentage", value: gst },
      });

      handleFormChange({
        target: { name: "itemPartNo", value: item },
      });

      handleFormChange({
        target: { name: "partyName", value: party },
      });
      handleFormChange({
        target: { name: "invoiceNo", value: invoice },
      });

      handleFormChange({
        target: { name: "creditDays", value: credit },
      });
    }
  };

  // * form validation

  const isFormValidated = (form) => {
    for (let key in form) {
      if (form[key] === null || form[key] === undefined || form[key] === "") {
        handleModal(
          "❌ Error",
          `Please fill "${key
            .replace(/[A-Z]/g, (match) => " " + match)
            .trim()
            .toUpperCase()}" field.`,
          "Okay"
        );
        window.purchase_modal_1.showModal();

        return false;
      }
    }
    return true;
  };

  // * handle the add button

  const addSingleFormContent = () => {
    // * Converting the new Date() to dd-mm-yyyy format

    const dateToFormattedString = (date) => {
      var dateString = `${date}`;
      var date = new Date(dateString);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      var formattedDate =
        (day < 10 ? "0" + day : day) +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        year;

      return formattedDate;
    };

    // * mutable values
    let gstValue =
      formData?.gstType === "Exempt"
        ? 0
        : parseInt(formData?.gstPercentage?.split("%")[0]?.trim());
    let disc = 0;
    let purchaseType = "";
    let eligibility = "Goods/Services";
    let bill = "GST";
    let cgst = 0;
    // * discount calculation

    if (formData?.gstType === "Exempt") {
      gstValue = 0;
      bill = "Main";
      cgst = 0;
      purchaseType = "EXEMPT";
      disc = ExemptCalc(formData?.mrp, formData?.amount, formData?.quantity);
      eligibility = "None";
    } else if (formData?.gstType === "Inclusive") {
      purchaseType = "GST(INCL)";
      disc = InclusiveCalc(formData?.mrp, formData?.amount, formData?.quantity);
      cgst = parseInt(gstValue / 2);
    } else {
      purchaseType = "GST(INCL)";
      disc = ExclusiveCalc(
        formData?.mrp,
        formData?.amount,
        gstValue,
        formData?.quantity
      );
      cgst = parseInt(gstValue / 2);
    }

    if (formData?.purchaseType === "DM" && formData?.gstType === "Exclusive") {
      disc = exclusiveDM(
        formData?.mrp,
        formData?.quantity,
        formData?.mDiscPercentage,
        gstValue
      );
    } else if (formData?.purchaseType === "DM") {
      disc = formData?.mDiscPercentage;
    }

    // calculate the Total amount:

    const amountField = TotalAmountCalc(
      formData?.mrp,
      disc,
      formData?.quantity
    );

    // * setting the content after all operations

    const tempContent = {
      billSeries: bill,
      billDate: dateToFormattedString(formData?.invoiceDate),
      purchaseType: purchaseType,
      partyName: formData?.partyName,
      eligibility: eligibility,
      invoiceNo: formData?.invoiceNo,
      itemName: formData?.itemPartNo,
      quantity: formData?.quantity,
      unit: formData?.unit,
      mrp: formData?.mrp,
      disc: disc,
      amount: amountField,
      cgst: cgst,
      sgst: cgst,
    };

    if (excelContent?.length === 0) {
      // credit days function

      const getFutureDate = (curDate, fuDay) => {
        const tempDate = new Date(curDate);
        tempDate.setDate(tempDate.getDate() + fuDay);
        return tempDate;
      };

      const futureCreditDay = dateToFormattedString(
        getFutureDate(formData?.invoiceDate, formData?.creditDays)
      );

      tempContent.bill_ref_due_date = futureCreditDay;
    }

    const modalConfirmedAdd = () => {
      setExcelContent((prevArray) => [...prevArray, tempContent]);

      // * saving the data to localStorage
      storeNotDownload(tempContent);

      // * show the modal
      handleModal("Success", "Content Added Successfully!", "Okay");
      window.purchase_modal_1.showModal();

      // * clearing some fields

      handleFormChange({
        target: {
          name: "itemPartNo",
          value: null,
        },
      });
      handleFormChange({
        target: {
          name: "quantity",
          value: null,
        },
      });
      handleFormChange({
        target: {
          name: "mrp",
          value: null,
        },
      });
      handleFormChange({
        target: {
          name: "gstPercentage",
          value: null,
        },
      });
      handleFormChange({
        target: {
          name: "amount",
          value: null,
        },
      });
    };

    handleConfirmationModal(
      "Confirmation",
      "Are you sure you want to add this content?",
      "Yes",
      "No",
      [
        {
          data: `🎫 Discount: ${disc}%`,
          style: "text-xl font-bold text-orange-500",
        },
        {
          data: `🗺 Location: ${formData?.itemLocation}`,
          style: "text-xl font-bold",
        },
        {
          data: `📜 Invoice: ${formData?.invoiceNo}`,
          style: "text-xl font-bold",
        },
        {
          data: `Party: ${formData?.partyName}`,
          style: "text-sm",
        },
        {
          data: `Item: ${formData?.itemPartNo}`,
          style: "text-sm",
        },
      ],
      modalConfirmedAdd,
      () => {}
    );
    window.purchase_modal_2.showModal();
  };

  // * create Excel file

  const createSheet = () => {
    if (excelContent.length === 0) {
      handleModal(
        "⚠ Empty",
        "The file is empty. Add one item before generating excel file.",
        "Okay"
      );
      window.purchase_modal_1.showModal();
      return;
    }
    // empty variable to restore.

    let content = [];
    let BILL_REF_AMOUNT = 0;

    // do not touch this.
    excelContent.forEach((e) => {
      content.push(e);
      BILL_REF_AMOUNT += e?.amount;
    });
    content[0].BILL_REF_AMOUNT = Math.round(BILL_REF_AMOUNT);

    let data = [
      {
        sheet: "Sheet1",
        columns: [
          { label: "BILL SERIES", value: "billSeries" },
          { label: "BILL DATE", value: "billDate" },
          { label: "Purc Type", value: "purchaseType" },
          { label: "PARTY NAME", value: "partyName" },
          { label: "ITC ELIGIBILITY", value: "eligibility" },
          { label: "NARRATION", value: "invoiceNo" },
          { label: "ITEM NAME", value: "itemName" },
          { label: "QTY", value: "quantity", format: "0" },
          { label: "Unit", value: "unit" },
          { label: "PRICE", value: "mrp", format: "0.00" },
          { label: "DISC%", value: "disc", format: "0.00" },
          { label: "Amount", value: "amount", format: "0.00" },
          { label: "CGST", value: "cgst", format: "0" },
          { label: "SGST", value: "sgst", format: "0" },

          { label: "BILL_REF", value: "invoiceNo" },
          {
            label: "BILL_REF_AMOUNT", // * total amount
            value: "BILL_REF_AMOUNT",
            format: "0",
          },
          {
            label: "BILL_REF_DUE_DATE", // * credit days with current days
            value: "bill_ref_due_date",
          },
        ],
        content,
      },
    ];

    DownloadExcel(content[0]?.partyName, content[0]?.invoiceNo, data);
  };

  // * download the excel file

  const DownloadExcel = (fileName, invoice, data) => {
    const settings = {
      fileName: `${fileName}-${invoice?.split("-")[1] || invoice}`,
      extraLength: 3,
      writeMode: "writeFile",
      writeOptions: {},
      RTL: false,
    };
    let callback = function () {
      console.log("File Downloaded..");
      // * send the document to purchase history
      sendPurchaseHistory(fileName, invoice, data);
      // * clear the localStorage
      clearLocalStorage("PURCHASE_NOT_DOWNLOAD_DATA");
    };
    xlsx(data, settings, callback);
  };

  // * upload the document to history

  const sendPurchaseHistory = (partyname, invoice, sheet) => {
    handleModal(
      "⏳ Uploading...",
      "Please wait while we upload your document...",
      "Okay"
    );
    window.purchase_modal_1.showModal();

    const payload = {
      sheetdata: JSON.stringify(sheet),
      items: sheet[0]?.content?.length,
      invoice,
      partyname,
      desc: "purchase",
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    fetch("/api/purchases", options)
      .then((response) => {
        if (response.status === 200) {
          // ? show modal
          handleModal("Uploaded ✔", "The document has been uploaded", "Okay");
          window.purchase_modal_1.showModal();
        } else {
          handleModal(
            "Uploaded Failed ❌",
            "Kindly re-download the document",
            "Okay"
          );
          window.purchase_modal_1.showModal();
        }
      })
      .catch((err) => {
        handleModal(
          "Uploaded Failed ❌",
          "Kindly re-download the document",
          "Okay"
        );
        window.purchase_modal_1.showModal();
      });
  };

  return (
    <>
      <dialog id="purchase_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{modalMessage?.title}</h3>
          <p className="py-4">{modalMessage?.message}</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">{modalMessage?.button}</button>
          </div>
        </form>
      </dialog>

      <dialog id="purchase_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">{modalConfirmation?.title}</h3>
          <p className="py-4">{modalConfirmation?.message}</p>
          {
            // * if there is a message array, it will show the message
            modalConfirmation?.messages?.map((e, i) => {
              return (
                <p key={i} className={[`${e?.style} text-teal-700`]}>
                  {e?.data}
                </p>
              );
            })
          }
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={() => modalConfirmation?.btn_f_1()}
              className="btn"
            >
              {modalConfirmation?.button_1}
            </button>
            <button
              onClick={() => modalConfirmation?.btn_f_2()}
              className="btn"
            >
              {modalConfirmation?.button_2}
            </button>
          </div>
        </form>
      </dialog>

      <h1 className="text-center">Purchase Module Ver 2.0.0 (TESTING)</h1>
      <div className="text-center m-auto">
        {loadingExcel && (
          <span className="loading loading-infinity w-[80px] text-sky-500"></span>
        )}

        <div className="m-5 flex justify-between flex-col">
          {partyData?.length > 0 && (
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              components={{ Option: CustomOption, MenuList: CustomMenuList }}
              placeholder="PARTY NAME"
              className="w-full m-auto p-5 text-blue-800 font-bold"
              getOptionLabel={(option) => `${option["value"]}`}
              options={partyData}
              value={
                formData?.partyName && {
                  value: formData.partyName,
                  creditDays: formData?.creditDays,
                }
              }
              onChange={(e) => {
                console.log("PARTY NAME SELECT: ", e);
                handleFormChange({
                  target: { name: "partyName", value: e.value },
                });
                handleFormChange({
                  target: {
                    name: "creditDays",
                    value:
                      isNaN(e?.creditDays) || e?.creditDays === ""
                        ? 0
                        : e?.creditDays,
                  },
                });
              }}
              noOptionsMessage={() => {
                return (
                  <p
                    onClick={() => router.push("/party")}
                    className="hover:cursor-pointer"
                  >
                    ➕ Add Party
                  </p>
                );
              }}
            />
          )}

          <div className="flex justify-center items-center flex-wrap">
            {!loadingExcel && (
              <input
                placeholder="Invoice No"
                className="input input-bordered input-secondary m-5 uppercase w-[295px]"
                type="text"
                disabled={excelContent?.length > 0}
                value={formData?.invoiceNo || ""}
                onChange={(e) => {
                  handleFormChange({
                    target: {
                      name: "invoiceNo",
                      value: e.target.value?.toUpperCase(),
                    },
                  });
                }}
              />
            )}

            <DatePicker
              className="input input-bordered input-secondary w-[295px] m-5 hover:cursor-pointer"
              placeholderText="INVOICE DATE"
              showPopperArrow={true}
              maxDate={new Date()}
              todayButton="Today"
              dateFormat="dd/MM/yyyy"
              selected={formData?.invoiceDate ?? new Date()}
              onChange={(selectedDate) => {
                handleFormChange({
                  target: {
                    name: "invoiceDate",
                    value: selectedDate,
                  },
                });
              }}
            />
          </div>

          {!loadingExcel && (
            <Select
              placeholder="GST Type"
              isSearchable={false}
              className="w-full m-auto p-5 text-blue-800 font-bold"
              options={gstType}
              getOptionLabel={(option) => `${option["value"]}`}
              value={formData?.gstType && { value: formData.gstType }}
              onChange={(e) => {
                if (e?.value === "Exempt") {
                  handleFormChange({
                    target: {
                      name: "gstPercentage",
                      value: 0,
                    },
                  });
                }
                handleFormChange({
                  target: { name: "gstType", value: e.value },
                });
              }}
            />
          )}
          {!loadingExcel && (
            <div>
              <Select
                placeholder="PURCHASE TYPE"
                className="w-full m-auto p-5 text-blue-800 font-bold"
                isSearchable={false}
                options={purchasetype}
                onChange={(e) => {
                  if (e?.value === "DM") {
                    // * whenever the purchase type is DM, the amount field will be hidden & zero.
                    handleFormChange({
                      target: {
                        name: "amount",
                        value: 0,
                      },
                    });
                  }
                  handleFormChange({
                    target: { name: "purchaseType", value: e.value },
                  });
                }}
                value={
                  formData?.purchaseType && {
                    label: `${
                      formData?.purchaseType === "DNM"
                        ? "Discount Not Mentioned"
                        : "Discount Mentioned"
                    }`,
                    value: formData.purchaseType,
                  }
                }
                defaultValue={{ label: "Discount Not Mentioned", value: "DNM" }}
                isClearable={false}
              />
              <input
                hidden={formData?.purchaseType === "DNM"}
                value={formData?.mDiscPercentage || ""}
                onChange={(e) => {
                  handleFormChange({
                    target: {
                      name: "mDiscPercentage",
                      value: e.target.value,
                    },
                  });
                }}
                className="input input-bordered input-secondary w-[295px] m-5"
                placeholder="MENTIONED DISC %"
                type="number"
                onWheel={(e) => {
                  e.target.blur();
                }}
              />
            </div>
          )}

          {itemData?.length > 0 && (
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              components={{ Option: CustomOption, MenuList: CustomMenuList }}
              placeholder="ITEM / PART NO."
              className="w-full m-auto p-5 text-blue-800 font-bold"
              options={itemData}
              value={
                formData?.itemPartNo && {
                  value: formData.itemPartNo,
                  loc: formData?.itemLocation,
                  mrp: formData?.mrp,
                  gst: formData?.gstPercentage,
                }
              }
              onChange={(e) => {
                console.log("ITEM SELECT: ", e);
                handleFormChange({
                  target: { name: "itemPartNo", value: e.value },
                });
                handleFormChange({
                  target: {
                    name: "itemLocation",
                    value: e?.loc || "N/A",
                  },
                });
                handleFormChange({
                  target: {
                    name: "mrp",
                    value: isNaN(e?.mrp) || e?.mrp === "" ? null : e?.mrp, // * if mrp is not a number, then it will be null
                  },
                });

                if (formData?.gstType !== "Exempt") {
                  // * if gst type is exempt, then it will not change the gst percentage
                  handleFormChange({
                    target: {
                      name: "gstPercentage",
                      value:
                        isNaN(e?.gst) || e?.gst === "" ? null : `${e?.gst}%`,
                    },
                  });
                }
              }}
              getOptionLabel={(option) =>
                `${option["value"]} ${option["pn"] || ""}`
              }
              noOptionsMessage={() => {
                return (
                  <p
                    onClick={() => router.push("/purchase/item")}
                    className="hover:cursor-pointer"
                  >
                    ➕ Add Item
                  </p>
                );
              }}
            />
          )}

          <div>
            <input
              onChange={(e) => {
                handleFormChange({
                  target: { name: "quantity", value: e.target.value },
                });
              }}
              className="input input-bordered input-secondary w-[295px] m-5"
              placeholder="Quantity"
              type="number"
              onWheel={(e) => {
                e.target.blur();
              }}
              value={formData?.quantity || ""}
            />
            <input
              onChange={(e) => {
                handleFormChange({
                  target: { name: "mrp", value: e.target.value },
                });
              }}
              value={formData?.mrp || ""}
              className="input input-bordered input-secondary w-[295px] m-5"
              placeholder="MRP"
              type="number"
              onWheel={(e) => {
                e.target.blur();
              }}
            />
          </div>

          {!loadingExcel && (
            <Select
              isDisabled={formData?.gstType === "Exempt"}
              placeholder="GST %"
              isSearchable={false}
              className="w-full m-auto p-5 text-blue-800 font-bold"
              options={gstAmount}
              getOptionLabel={(option) => `${option["value"]}`}
              value={
                formData?.gstPercentage && { value: formData.gstPercentage }
              }
              onChange={(e) => {
                console.log(e);
                handleFormChange({
                  target: { name: "gstPercentage", value: e.value },
                });
              }}
            />
          )}
        </div>

        <input
          onChange={(e) => {
            handleFormChange({
              target: { name: "amount", value: e.target.value },
            });
          }}
          value={formData?.amount || ""}
          className="input input-bordered input-secondary w-[295px] m-5"
          placeholder="Total Amount"
          type="number"
          hidden={formData?.purchaseType === "DM"}
          onWheel={(e) => {
            e.target.blur();
          }}
        />

        <br />
      </div>

      <div className="py-20"></div>
      {/* Bottom Nav Bar */}
      <div className="btm-nav glass bg-blue-800">
        <button
          onClick={() => {
            createSheet();
          }}
          className=" text-white hover:bg-blue-900"
        >
          <Image
            className=""
            src="/assets/images/download (1).png"
            width={50}
            height={50}
            alt="icon"
          ></Image>
          <span className="mb-6 text-xl font-mono">Download</span>
        </button>
        <button
          onClick={() => {
            if (isFormValidated(formData)) {
              addSingleFormContent();
            }
          }}
          className="text-white hover:bg-blue-900"
        >
          <Image
            className="mb-20"
            src="/assets/images/add-button.png"
            width={70}
            height={70}
            alt="icon"
          ></Image>
        </button>
        <button onClick={() => {}} className="text-white hover:bg-blue-900">
          <Image
            src="/assets/images/remove.png"
            width={50}
            height={50}
            alt="icon"
          ></Image>
          <span className="mb-6 text-xl font-mono">Reset</span>
        </button>
      </div>
    </>
  );
}
