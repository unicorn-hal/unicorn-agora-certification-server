import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export interface AgoraCertificatedData {
    uid: number;
    token: string;
}
export class AgoraTokenGenerator {
    private appId: string;
    private appCertificate: string;
    private channelName: string;
    private uid: number;
    private role: number;
    private privilegeExpiredTs: number;

    constructor(channelName: string) {
        this.appId = process.env.AGORA_APP_ID;
        this.appCertificate = process.env.AGORA_APP_CERTIFICATE;
        this.channelName = channelName;
        this.uid = Math.floor(Math.random() * 9000000) + 1000000; // 7桁のランダムな数値
        this.role = RtcRole.PUBLISHER;
        this.privilegeExpiredTs = Math.floor(Date.now() / 1000) + 360;

        if (this.appId === '' || this.appCertificate === '') {
            console.log('環境変数 AGORA_APP_ID と AGORA_APP_CERTIFICATE を設定する必要があります');
            process.exit(1);
        }
    }

    public generateRtcTokenWithUid(): AgoraCertificatedData {
        const token = RtcTokenBuilder.buildTokenWithUid(
            this.appId,
            this.appCertificate,
            this.channelName,
            this.uid,
            this.role,
            this.privilegeExpiredTs,
        );
        return {
            uid: this.uid,
            token: token,
        };
    }
}