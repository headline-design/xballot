import TextAutolinker from 'components/TextAutoLinker';
import { NoticeIcon } from "icons/NoticeIcon";

export default function ProfileWalletInfo({ info }: { info: string }) {
    return (
        <div className="mx-4 mb-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:mx-0 md:rounded-xl md:border">
            <div className="p-4 leading-5 sm:leading-6">
                <div>
                    <NoticeIcon />
                    <div className="leading-5 flex">
                        <TextAutolinker text={info} />
                    </div>
                </div>
            </div>
        </div>

    );
}
