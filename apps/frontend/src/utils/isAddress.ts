export declare function getAddress(address: string): string;
export declare function isAddress(address: string): boolean;
export declare function getIcapAddress(address: string): string;
export declare function getContractAddress(transaction: {
    from: string;
}): string;
export declare function getCreate2Address(from: string): string;