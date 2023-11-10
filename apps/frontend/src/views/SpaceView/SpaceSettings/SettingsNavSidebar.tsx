import { CtaForm } from "components/CtaForm";

function SettingsNavSidebar({ setStep, formData }) {

    const buttonData = [
        { label: 'General', step: 1 },
        { label: 'Strategies', step: 2 },
        { label: 'Proposal', step: 3 },
        { label: 'Controller', step: 4 },
        { label: 'Forum', step: 5 },
        { label: 'Advanced', step: 6 },
    ];

    return (
        <>
        <div id="sidebar-left" className="float-left w-full lg:mb-4 lg:fixed lg:mb-0 lg:w-[240px]">
            <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border overflow-hidden !border-t-0 md:!border-t">
                <div className="leading-5 sm:leading-6">
                    <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
                        <div className="no-scrollbar mt-0 flex overflow-y-auto md:mt-4 lg:my-3 lg:block">

                            {buttonData.map((button, index) => (
                                <div
                                    key={index}
                                    onClick={() => setStep(button.step)}
                                    className={`${formData.step === button.step ? 'border-l-[0px] border-b-[3px] !pl-[21px] lg:border-b-[0px] lg:border-l-[3px]' : ''
                                        } block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg`}
                                >
                                    {button.label}
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            <CtaForm />
        </div>

        </>
    );
}

export default SettingsNavSidebar;
