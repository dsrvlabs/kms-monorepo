import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Uint53 } from "@cosmjs/math";
import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgSend, MsgMultiSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import {
  MsgDeposit,
  MsgSubmitProposal,
  MsgVote,
} from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import {
  MsgAcknowledgement,
  MsgChannelCloseConfirm,
  MsgChannelCloseInit,
  MsgChannelOpenAck,
  MsgChannelOpenConfirm,
  MsgChannelOpenInit,
  MsgChannelOpenTry,
  MsgRecvPacket,
  MsgTimeout,
  MsgTimeoutOnClose,
} from "cosmjs-types/ibc/core/channel/v1/tx";
import {
  MsgCreateClient,
  MsgSubmitMisbehaviour,
  MsgUpdateClient,
  MsgUpgradeClient,
} from "cosmjs-types/ibc/core/client/v1/tx";
import {
  MsgConnectionOpenAck,
  MsgConnectionOpenConfirm,
  MsgConnectionOpenInit,
  MsgConnectionOpenTry,
} from "cosmjs-types/ibc/core/connection/v1/tx";
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgInstantiateContract as OriginalMsgInstantiateContract,
  MsgMigrateContract as OriginalMsgMigrateContract,
  MsgStoreCode,
  MsgUpdateAdmin,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

const MsgInstantiateContract = {
  ...OriginalMsgInstantiateContract,
  encode: (
    message: OriginalMsgInstantiateContract,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer => {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.admin !== "") {
      writer.uint32(18).string(message.admin);
    }
    if (message.codeId) {
      if (message.codeId.isZero && !message.codeId.isZero()) {
        writer.uint32(24).uint64(message.codeId);
      }
      if (typeof message.codeId === "number") {
        writer
          .uint32(24)
          .uint64(Long.fromString(new Uint53(message.codeId).toString()));
      }
      if (typeof message.codeId === "string") {
        writer
          .uint32(24)
          .uint64(
            Long.fromString(new Uint53(parseInt(message.codeId, 10)).toString())
          );
      }
    }
    if (message.label !== "") {
      writer.uint32(34).string(message.label);
    }
    if (message.msg.length !== 0) {
      writer.uint32(42).bytes(message.msg);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const v of message.funds) {
      Coin.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
};

const MsgMigrateContract = {
  ...OriginalMsgMigrateContract,
  encode: (
    message: OriginalMsgMigrateContract,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer => {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.contract !== "") {
      writer.uint32(18).string(message.contract);
    }
    if (message.codeId) {
      if (message.codeId.isZero && !message.codeId.isZero()) {
        writer.uint32(24).uint64(message.codeId);
      }
      if (typeof message.codeId === "number") {
        writer
          .uint32(24)
          .uint64(Long.fromString(new Uint53(message.codeId).toString()));
      }
      if (typeof message.codeId === "string") {
        writer
          .uint32(24)
          .uint64(
            Long.fromString(new Uint53(parseInt(message.codeId, 10)).toString())
          );
      }
    }
    if (message.msg.length !== 0) {
      writer.uint32(34).bytes(message.msg);
    }
    return writer;
  },
};

const bankTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmos.bank.v1beta1.MsgMultiSend", MsgMultiSend],
  ["/cosmos.bank.v1beta1.MsgSend", MsgSend],
];

const distributionTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmos.distribution.v1beta1.MsgFundCommunityPool", MsgFundCommunityPool],
  ["/cosmos.distribution.v1beta1.MsgSetWithdrawAddress", MsgSetWithdrawAddress],
  [
    "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    MsgWithdrawDelegatorReward,
  ],
  [
    "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission",
    MsgWithdrawValidatorCommission,
  ],
];

const govTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmos.gov.v1beta1.MsgDeposit", MsgDeposit],
  ["/cosmos.gov.v1beta1.MsgSubmitProposal", MsgSubmitProposal],
  ["/cosmos.gov.v1beta1.MsgVote", MsgVote],
];

const stakingTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmos.staking.v1beta1.MsgBeginRedelegate", MsgBeginRedelegate],
  ["/cosmos.staking.v1beta1.MsgCreateValidator", MsgCreateValidator],
  ["/cosmos.staking.v1beta1.MsgDelegate", MsgDelegate],
  ["/cosmos.staking.v1beta1.MsgEditValidator", MsgEditValidator],
  ["/cosmos.staking.v1beta1.MsgUndelegate", MsgUndelegate],
];

const ibcTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/ibc.applications.transfer.v1.MsgTransfer", MsgTransfer],
  ["/ibc.core.channel.v1.MsgAcknowledgement", MsgAcknowledgement],
  ["/ibc.core.channel.v1.MsgChannelCloseConfirm", MsgChannelCloseConfirm],
  ["/ibc.core.channel.v1.MsgChannelCloseInit", MsgChannelCloseInit],
  ["/ibc.core.channel.v1.MsgChannelOpenAck", MsgChannelOpenAck],
  ["/ibc.core.channel.v1.MsgChannelOpenConfirm", MsgChannelOpenConfirm],
  ["/ibc.core.channel.v1.MsgChannelOpenInit", MsgChannelOpenInit],
  ["/ibc.core.channel.v1.MsgChannelOpenTry", MsgChannelOpenTry],
  ["/ibc.core.channel.v1.MsgRecvPacket", MsgRecvPacket],
  ["/ibc.core.channel.v1.MsgTimeout", MsgTimeout],
  ["/ibc.core.channel.v1.MsgTimeoutOnClose", MsgTimeoutOnClose],
  ["/ibc.core.client.v1.MsgCreateClient", MsgCreateClient],
  ["/ibc.core.client.v1.MsgSubmitMisbehaviour", MsgSubmitMisbehaviour],
  ["/ibc.core.client.v1.MsgUpdateClient", MsgUpdateClient],
  ["/ibc.core.client.v1.MsgUpgradeClient", MsgUpgradeClient],
  ["/ibc.core.connection.v1.MsgConnectionOpenAck", MsgConnectionOpenAck],
  [
    "/ibc.core.connection.v1.MsgConnectionOpenConfirm",
    MsgConnectionOpenConfirm,
  ],
  ["/ibc.core.connection.v1.MsgConnectionOpenInit", MsgConnectionOpenInit],
  ["/ibc.core.connection.v1.MsgConnectionOpenTry", MsgConnectionOpenTry],
];

const wasmTypes: ReadonlyArray<[string, GeneratedType]> = [
  ["/cosmwasm.wasm.v1.MsgClearAdmin", MsgClearAdmin],
  ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
  ["/cosmwasm.wasm.v1.MsgMigrateContract", MsgMigrateContract],
  ["/cosmwasm.wasm.v1.MsgStoreCode", MsgStoreCode],
  ["/cosmwasm.wasm.v1.MsgInstantiateContract", MsgInstantiateContract],
  ["/cosmwasm.wasm.v1.MsgUpdateAdmin", MsgUpdateAdmin],
];

export const registry = new Registry([
  ...bankTypes,
  ...distributionTypes,
  ...govTypes,
  ...stakingTypes,
  ...ibcTypes,
  ...wasmTypes,
]);
