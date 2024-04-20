import startCase from "lodash/startCase";
import moment from "moment";

function transformforPropertyUnits(propertyUnits) {
  const units = [];
  const unitTypes = [];
  for (const propertyUnit of propertyUnits) {
    if (
      Array.isArray(propertyUnit.unittype_unit_details) &&
      propertyUnit.unittype_unit_details.length
    ) {
      units.push(
        ...propertyUnit.unittype_unit_details.map(unit => {
          return { ...unit, unit_type_id: propertyUnit.unit_type_id };
        })
      );
    }
    unitTypes.push(propertyUnit);
  }

  return {
    units,
    unitTypes
  };
}

const transformPropertyUnits = units => {
  let updatedUnits = [];
  if (units.length) {
    updatedUnits = units.map(unitType => {
      return {
        ...unitType,
        unit_type_id: unitType.unit_type_id,
        units: unitType.unittype_unit_details.map(unit => {
          return {
            ...unit,
            id: unit.unit_id,
            discount_type: unit.discount_type
              ? unit.discount_type.toLowerCase()
              : "percentage"
          };
        })
      };
    });
  }
  return updatedUnits;
};

function splitMonthAndYear(months) {
  if (!months.length) return [];
  const formatedMonths = months.map(month => {
    const date = moment(month.duration);
    return {
      payment_month: date.format("M"),
      payment_year: date.format("YYYY"),
      amount: month.amount
    };
  });
  return formatedMonths;
}

function downloadCSV(content, name) {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += content || [];
  const data = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", data);
  link.setAttribute("download", `Export ${name || ""}.csv`);
  link.click();
}

function getFileExtension(type) {
  return "." + type.split("/")[1];
}

function downloadImage(data, name) {
  try {
    const link = document.createElement("a");

    const blob = new Blob([data], { type: "image/*" });
    link.href = window.URL.createObjectURL(blob);
    link.target = "_blank";

    // eslint-disable-next-line no-useless-escape
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log("Error: Unable to download image - ", error);
  }
}

function transformToDropDown(arr) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.map(item => {
      return {
        label: item.property_name,
        code: item.id
      };
    });
  }

  return arr;
}

const transformPropertiesRequest = property => {
  const propertyData = property;

  if (propertyData.unit_types) {
    const unit_types = propertyData.unit_types;
    delete propertyData.unit_types;
    delete propertyData.units;

    propertyData.units = [];

    for (let i = 0; i < unit_types.length; i++) {
      const updatedUnits = unit_types[i].units.map(value => {
        return {
          ...value,
          unittype: unit_types[i].unit_type_id
        };
      });

      propertyData.units.push(...updatedUnits);
    }
  }

  return propertyData;
};

function formatDate(date) {
  return moment(new Date(date)).format("YYYY-MM-DDThh:mm");
}

function formatDateForList(date) {
  return moment(date).format("DD-MM-YYYY hh:mm:ss A");
}

function formateDateDefault(date) {
  return moment(new Date(date)).format("DD-MM-YYYY");
}

function defaultFormat(date, containsTime) {
  if (containsTime) {
    return moment(new Date(date)).format("DD-MM-YYYY hh:mm:ss A");
  }
  return moment(new Date(date)).format("DD-MM-YYYY");
}

function formatDateForPicker(date, containsTime) {
  if (containsTime) {
    let time = moment(Date()).format("Thh:mm:ssZ");
    return date + time;
  }
  return moment(new Date(date)).format("YYYY-MM-DD");
}

function calcualteNetInvoiceAmount(item) {
  let invoice_amount = 0;
  const price = item.price || 0;
  if (item.discount_type === "percentage") {
    const percentageData = (item.discount / 100) * price;

    invoice_amount = (price - percentageData).toFixed(3);
  } else {
    invoice_amount = (price - item.discount).toFixed(3);
  }
  return invoice_amount;
}

function capitalizeFirstLetter(str) {
  return startCase(str);
}

function getYear(date) {
  if (date) {
    return moment(date, "YYYY/MM/DD").format("YYYY");
  }
  return "-";
}

function numToMonth(date) {
  if (date) {
    return moment(date, "YYYY/MM/DD").format("MM");
  }
  return "-";
}

export {
  formatDate,
  downloadCSV,
  downloadImage,
  defaultFormat,
  getFileExtension,
  formatDateForList,
  splitMonthAndYear,
  formateDateDefault,
  transformToDropDown,
  formatDateForPicker,
  capitalizeFirstLetter,
  transformPropertyUnits,
  calcualteNetInvoiceAmount,
  transformPropertiesRequest,
  transformforPropertyUnits,
  getYear,
  numToMonth
};
