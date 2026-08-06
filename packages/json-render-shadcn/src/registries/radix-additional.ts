import type { ElementType } from "react";

import type { AdditionalShadcnPrimitiveName } from "../components/types";
import * as alertDialog from "../generated/radix/ui/alert-dialog";
import * as aspectRatio from "../generated/radix/ui/aspect-ratio";
import * as attachment from "../generated/radix/ui/attachment";
import * as breadcrumb from "../generated/radix/ui/breadcrumb";
import * as bubble from "../generated/radix/ui/bubble";
import * as calendar from "../generated/radix/ui/calendar";
import * as chart from "../generated/radix/ui/chart";
import * as combobox from "../generated/radix/ui/combobox";
import * as command from "../generated/radix/ui/command";
import * as contextMenu from "../generated/radix/ui/context-menu";
import * as empty from "../generated/radix/ui/empty";
import * as field from "../generated/radix/ui/field";
import * as hoverCard from "../generated/radix/ui/hover-card";
import * as inputGroup from "../generated/radix/ui/input-group";
import * as inputOtp from "../generated/radix/ui/input-otp";
import * as item from "../generated/radix/ui/item";
import * as kbd from "../generated/radix/ui/kbd";
import * as marker from "../generated/radix/ui/marker";
import * as menubar from "../generated/radix/ui/menubar";
import * as message from "../generated/radix/ui/message";
import * as messageScroller from "../generated/radix/ui/message-scroller";
import * as nativeSelect from "../generated/radix/ui/native-select";
import * as navigationMenu from "../generated/radix/ui/navigation-menu";
import * as resizable from "../generated/radix/ui/resizable";
import * as scrollArea from "../generated/radix/ui/scroll-area";
import * as sheet from "../generated/radix/ui/sheet";
import * as sidebar from "../generated/radix/ui/sidebar";
import * as sonner from "../generated/radix/ui/sonner";

export const radixAdditionalPrimitives = {
	...alertDialog,
	...aspectRatio,
	...attachment,
	...breadcrumb,
	...bubble,
	...calendar,
	...chart,
	...combobox,
	...command,
	...contextMenu,
	...empty,
	...field,
	...hoverCard,
	...inputGroup,
	...inputOtp,
	...item,
	...kbd,
	...marker,
	...menubar,
	...message,
	...messageScroller,
	...nativeSelect,
	...navigationMenu,
	...resizable,
	...scrollArea,
	...sheet,
	...sidebar,
	...sonner,
} as unknown as Partial<Record<AdditionalShadcnPrimitiveName, ElementType>>;
