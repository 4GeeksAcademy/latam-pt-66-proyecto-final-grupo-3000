import React from "react";

export const AuthShell = ({
    children,
    panelIcon,
    panelTitle,
    panelText,
    formTitle,
    formSubtitle,
    pageClassName = "",
    panelClassName = "",
    reverse = false,
}) => {
    const panelOrderClass = reverse ? "order-md-2" : "order-md-1";
    const formOrderClass = reverse ? "order-md-1" : "order-md-2";
    const panelAnimationClass = reverse ? "auth-panel--slide-left" : "auth-panel--slide-right";
    const formAnimationClass = reverse ? "auth-form--slide-right" : "auth-form--slide-left";

    return (
        <div className={`min-vh-100 d-flex align-items-center justify-content-center bg-light p-3 ${pageClassName}`.trim()}>
            <div className="card auth-card shadow-lg border-0 overflow-hidden">
                <div className={`row g-0 auth-card__row ${reverse ? "auth-card__row--reverse" : ""}`}>
                    <div className={`col-12 col-md-5 bg-gradient-blue d-flex flex-column justify-content-center align-items-center p-5 text-white text-center ${panelOrderClass} ${panelAnimationClass} ${panelClassName}`.trim()}>
                        <div className="bg-white p-3 rounded-circle mb-3 shadow auth-panel__icon">
                            <i className={`${panelIcon} text-info fs-1`}></i>
                        </div>
                        <h2 className="fw-bold auth-panel__title">{panelTitle}</h2>
                        <p className="small opacity-75 auth-panel__text">{panelText}</p>
                    </div>

                    <div className={`col-12 col-md-7 bg-white p-4 p-lg-5 ${formOrderClass} ${formAnimationClass}`}>
                        <div className="mb-4">
                            <h1 className="fw-bold title_form">{formTitle}</h1>
                            <p className="text-muted mb-0">{formSubtitle}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};