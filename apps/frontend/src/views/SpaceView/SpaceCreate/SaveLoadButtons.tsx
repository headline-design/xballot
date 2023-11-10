import { Button } from "components/BaseComponents/Button";

export function SaveLoadButtons({ handleSaveDraft, handleLoadDraft }) {
    return (
        <div className="p-4 leading-5 sm:leading-6">
            <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
                <Button
                    type="button"
                    onClick={handleSaveDraft}
                    className="button mb-2 block w-full px-[22px]"
                    data-v-1b931a55
                >
                    Save draft
                </Button>
                <Button
                    type="button"
                    onClick={handleLoadDraft}
                    className="button mb-2 block w-full px-[22px]"
                    data-v-1b931a55
                >
                    Load draft
                </Button>
            </div>
        </div>

    )
}