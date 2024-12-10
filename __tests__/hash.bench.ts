import { bench, describe } from "vitest";

import { hash, hashSync } from "../src/index.js";

const lorem = `\
Lorem ipsum odor amet, consectetuer adipiscing elit. Fames ex vivamus ut eros consectetur quam? Condimentum tristique bibendum orci; eleifend habitasse felis. Platea libero conubia at risus nisi. Taciti turpis pharetra magnis duis parturient. Odio commodo sollicitudin vel risus viverra arcu nisi. Molestie mauris facilisi metus dolor fringilla et est duis. Sollicitudin enim torquent fusce adipiscing luctus elit. Taciti ultricies sodales augue conubia lacus fusce. Venenatis condimentum montes lectus curae varius odio pulvinar.

Non varius neque orci; turpis purus bibendum. Id diam interdum proin class eget mattis cras pretium. Id metus vulputate interdum finibus metus. Suscipit cras euismod porttitor vel ad ante felis tincidunt? Diam tempus finibus fames potenti tincidunt morbi. Nascetur taciti libero nam aliquam quisque mauris massa. Justo ac nisi mattis est pulvinar quis. Sagittis mollis felis nam viverra ligula sed. Rhoncus purus amet lobortis senectus odio. Congue semper dolor feugiat ante molestie venenatis.

Litora interdum fusce torquent, bibendum condimentum potenti cubilia. Enim mattis morbi nullam penatibus tristique egestas elit. Nisi dis fermentum ultricies montes quam maecenas erat non. Vitae consequat sodales sem elementum vel viverra tortor. Mauris elementum urna morbi quis lacinia. Aenean ornare lacus tristique vitae porttitor senectus magna. Quam velit ex duis sagittis lacinia eleifend quisque purus potenti.

Eget ultricies potenti aptent augue eget quisque erat habitasse feugiat. Commodo id id urna ligula ornare, ornare praesent? Magnis nulla ultrices congue tortor ornare lectus. Vulputate vehicula parturient nulla porttitor quisque auctor nisi. Gravida dictum ultrices lacinia efficitur sollicitudin platea fusce. Justo etiam eget aliquet maximus feugiat. Sed leo imperdiet potenti purus cras feugiat.

Aliquet curae fames vel; purus dolor maecenas. Fermentum sagittis nulla ornare bibendum justo pellentesque lacinia, sem eleifend. Justo eleifend etiam suspendisse sagittis; fames ipsum. Sodales cras mus non metus sapien parturient maximus adipiscing blandit. Praesent amet risus; auctor molestie eros morbi. Torquent pulvinar sodales; a nisi cursus tempus. Dignissim ipsum placerat nisl litora auctor.
`;

describe("hash", () => {
  bench(
    "hash hello 5",
    async () => {
      await hash("hello", 5);
    },
    { iterations: 10 },
  );

  bench(
    "hash hello 10",
    async () => {
      await hash("hello", 10);
    },
    { iterations: 10 },
  );

  bench(
    "hash lorem 5",
    async () => {
      await hash(lorem, 5);
    },
    { iterations: 10 },
  );
});

describe("hashSync", () => {
  bench(
    "hashSync hello 5",
    () => {
      hashSync("hello", 5);
    },
    { iterations: 10 },
  );

  bench(
    "hashSync hello 10",
    () => {
      hashSync("hello", 10);
    },
    { iterations: 10 },
  );

  bench(
    "hashSync lorem 5",
    () => {
      hashSync(lorem, 5);
    },
    { iterations: 10 },
  );
});
