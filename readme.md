# Agora Token 認証サーバー - API仕様書

## 概要

このAPIは、指定されたチャンネル名に基づいて、Agora用のトークンとサーバーで生成されたUIDを返します。トークンの生成には認証が必要であり、各リクエストには有効な認証情報を含める必要があります。

## シークレットの管理

このプロジェクトで使用するシークレット（`AGORA_APP_ID`、`AGORA_APP_CERTIFICATE`）は、Google Cloud Platform の Secret Manager で安全に管理されています。デプロイ時に自動的に適用されます。

## 認証

- **認証方式**: Bearerトークン
- **ヘッダー**:
  - `Authorization`: `Bearer {token}` の形式で認証トークンを指定します。

認証トークンが提供されない、または無効な場合、サーバーは`403 Forbidden`エラーを返します。

## エンドポイント

### トークン取得

- **URL**: `/api/token`
- **メソッド**: `POST`
- **説明**: 指定されたチャンネル名に対応するAgoraトークンとサーバー生成のUIDを返します。

#### リクエストヘッダー

| ヘッダー名    | 必須 | 説明                            |
| ------------- | ---- | ------------------------------- |
| Authorization | 必須 | `Bearer {token}`形式の認証トークン |

#### リクエストボディ

- **データ形式**: `application/json`

| パラメーター名 | タイプ     | 必須 | 説明       |
| -------------- | ---------- | ---- | ---------- |
| channelName    | `string`   | 必須 | チャンネル名 |

#### レスポンス

- **成功時** `200 OK`

  ```json
  {
    "uid": <サーバーで生成されたUID>,
    "token": "<生成されたトークン>"
  }
  ```

- **エラーレスポンス**

  - **`400 Bad Request`**: リクエストボディに必要なパラメーターが含まれていない場合

    ```json
    {
      "error": "Bad Request"
    }
    ```

  - **`403 Forbidden`**: 認証に失敗した場合

    ```json
    {
      "error": "Forbidden"
    }
    ```

  - **`500 Internal Server Error`**: サーバー内部でエラーが発生した場合

    ```json
    {
      "error": "Internal Server Error"
    }
    ```

## 使用例

### リクエスト例

```shell
POST /api/token HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer your_auth_token

{
  "channelName": "testChannel"
}
```

### レスポンス例

```json
{
  "uid": 1234567,
  "token": "generated_agora_token_here"
}
```

## 注意事項

- `channelName`は必須パラメーターです。欠如している場合、`400 Bad Request`エラーが返されます。
- `uid`はサーバー側で生成され、レスポンスに含まれます。
- 認証トークンは有効である必要があります。不正または期限切れの場合、`403 Forbidden`エラーが返されます。
- サーバーはCORSを許可しています。適切なヘッダーを設定してリクエストを行ってください。

## サーバー情報

- **ポート番号**: `8080`
- **ホスト**: `0.0.0.0`

## 開発者向け情報

- このAPIはNode.jsとExpressを使用して構築されています。
- トークンの生成には `AgoraTokenGenerator` クラスを利用しています。
- 認証サービスは `AuthenticationService` クラスを使用しています。