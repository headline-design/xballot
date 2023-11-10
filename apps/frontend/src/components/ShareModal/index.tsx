import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import { getEndpoints } from 'utils/endPoints';

export default function ShareModal({ space, appId, isOpen, closeModal }) {
const endPoints = getEndpoints();
    const handleTwitterShare = () => {
        window.open(
            `https://twitter.com/intent/tweet?url=${endPoints.xballotUrl + space?.domain}&text=Look%20what%20I%20found!%20${space?.name}%20on%20XBallot%20&via=XBallotApp`,
            'twitter-share-dialog',
            'width=626,height=436',
        );
    };

    const handleFacebookShare = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${endPoints.xballotUrl + space?.domain}`,
            'facebook-share-dialog',
            'width=626,height=436'
        );
    };

    return (
        <Modal open={isOpen} onClose={closeModal} title="Share">
                            <div className="modal-body">
                                <div className="m-4">
                                    <div className="min-h-[150px] space-y-3">
                                        <div className="leading-5 sm:leading-6">
                                            <div>
                                                <Button className="mb-3 button button--secondary w-full px-[22px] hover:brightness-95"
                                                    data-v-4a6956ba=""
                                                    type="button">
                                                    <div
                                                        onClick={handleTwitterShare}
                                                    >
                                                        Share to Twitter
                                                    </div>
                                                </Button>
                                                <Button className="button button--secondary w-full px-[22px] hover:brightness-95"
                                                    data-v-4a6956ba=""
                                                    type="button">
                                                    <div
                                                        onClick={handleFacebookShare}>
                                                        Share to Facebook
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                type="button"
                                className="absolute right-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
                            >
                                <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <div className="border-t p-4 text-center">
                                <Button
                                    type="button"
                                    className="button button--secondary w-full px-[22px] hover:brightness-95"
                                    data-v-4a6956ba=""
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                            </div>
                            </Modal>
    );
}
