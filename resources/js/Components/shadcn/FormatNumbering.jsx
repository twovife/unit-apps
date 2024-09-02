import React from "react";
import { NumericFormat } from "react-number-format";

const FormatNumbering = ({ value = 0, prefix }) => {
    return (
        <div className="text-end">
            <NumericFormat
                value={value}
                displayType={"text"}
                thousandSeparator={","}
                prefix={prefix ?? ""}
            />
        </div>
    );
};

export default FormatNumbering;
