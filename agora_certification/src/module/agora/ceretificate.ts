import { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } from 'agora-access-token';

export class AgoraTokenGenerator {
    private appId: string;
    private appCertificate: string;
    private channelName: string;
    private uid: number;
    private role: number;

    constructor(channelName: string, uid: number, account?: string | undefined) {
        this.appId = process.env.AGORA_APP_ID;
        this.appCertificate = process.env.AGORA_APP_CERTIFICATE;
        this.channelName = channelName;
        this.uid = uid;
        this.role = RtcRole.PUBLISHER;

        if (this.appId === '' || this.appCertificate === '') {
            console.log('環境変数 AGORA_APP_ID と AGORA_APP_CERTIFICATE を設定する必要があります');
            process.exit(1);
        }
    }

    public generateRtmTokenWithUid(): string {
        return RtmTokenBuilder.buildToken(
            this.appId,
            this.appCertificate,
            this.channelName,
            this.uid,
            this.role,
        );
    }
}