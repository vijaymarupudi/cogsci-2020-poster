import m from "mithril";
import { clusteringDemo } from "./clustering-demo";
import "tachyons/css/tachyons.min.css";
import "./style.css";

const fn = func => ({ view: v => func({ ...v.attrs, children: v.children }) });

const Header = fn(() => {
  return m("div.pa3.bg-umn-maroon.umn-gold", [
    m("div.flex-l.items-center-l.mw8.center", [
      m("div.mr3", [
        m(
          "h1.ttl.tracked-tight",
          "Human reliability of the traveling salesman problem."
        ),
        m(
          "p.f4-l",
          m.trust(
            "Vijay&nbsp;Marupudi, V.N.&nbsp;Vimal&nbsp;Rao, Jimin&nbsp;Park, Rina&nbsp;M.&nbsp;Harsch, Jeffrey&nbsp;K.&nbsp;Bye, & Sashank&nbsp;Varma"
          )
        )
      ]),
      m("img.h3.h4-l", { src: "umn.png" })
    ])
  ]);
});

const Section = fn(({ heading, children }) => {
  return m(
    "div.ph3-l",
    m("h2.umn-maroon.ma0.bg-umn-gold.ttl.tracked-tight.pa3.mv2.mv3-l", heading),
    m("div.lh-copy.f4-l.ph2.ph3-l", children)
  );
});

const TSPBackground = fn(() => {
  return m("div.linked-content", [
    m("h3", "Traveling salesman problem"),
    m("ul", [
      m(
        "li",
        m(
          "a",
          {
            href:
              "https://simple.wikipedia.org/wiki/Travelling_salesman_problem#Stating_the_problem"
          },
          "Involves creating a tour which connects a set of cities while visiting each city exactly once."
        )
      ),
      m(
        "li",
        m(
          "a",
          { href: "https://doi.org/10.1016/S0927-0507(05)80121-5" },
          "Computers find this problem hard."
        )
      ),
      m(
        "li",
        m(
          "a",
          { href: "https://eric.ed.gov/?id=EJ1115819" },
          "Humans are nearly optimal for low numbers of cities."
        )
      ),
      m(
        "li",
        "Humans are pretty efficient, i.e., their solution time taken grows linearly with number of cities."
      ),
      m(
        "li",
        m(
          "a",
          { href: "https://doi.org/10.3758/BF03196857" },
          "It has been proposed that humans are guided by the external boundary of the cities (convex hull), but this strategy does not have a linear time complexity."
        )
      )
    ]),
    m("h3", "Hypothesis"),
    m("ul", [
      m(
        "li",
        m(
          "a",
          { href: "https://doi.org/10.3758/s13414-015-0925-2" },
          "People might be clustering the problems into mini-TSPs, solving them, and then connecting the clusters together."
        )
      ),
      m(
        "li",
        "This strategy could enable near-optimal, linear-time performance."
      )
    ])
  ]);
});

const ResearchQuestion = fn(() => {
  return m(
    "div",
    m("ul.list.pl0", [
      m("li.fw8.f4", "Is human clustering reliable to support this strategy?"),
      m("li.o-50", "Is human TSP performance reliable?"),
      m("li.o-50", "Do people’s clusters predict their TSP performance / path?")
    ])
  );
});

const Methods = fn(() => {
  const content = [
    ["Participants", "N = 47"],
    [
      "Procedure",
      "Participants clustered 112 dot clouds at a computer using a mouse."
    ],
    [
      "Measures",
      [
        "Number of clusters, cluster point membership, ",
        m("strong", "calculated Fowlkes-Mallows index"),
        ", time to complete clustering."
      ]
    ]
  ];

  return m.fragment(null, [
    m(
      "div.tc",
      m(
        "button.bg-umn-maroon.umn-gold.fw8.ba.b--black-30.br2.ph2.pv1.pointer.grow",
        { onclick: clusteringDemo },
        "Try a clustering trial yourself!"
      )
    ),
    ...content.map(([key, value]) =>
      m("p", [m("strong", key), ": ", m("span", value)])
    )
  ]);
});

const ClusterImage = fn(({ title, src }) =>
  m(
    "figure.flex.content-center.items-center.flex-column.shadow-1.ma2.pa2",
    m("img", { src }),
    m("figcaption", title)
  )
);

const ClusterImageContainer = fn(({ children }) => m("div.flex-l", children));

const Materials = fn(() => {
  return m("div", [
    m("h4.tc", "Dot clouds (n=112)"),
    m("h5.tc", "Structure: Clustered / Disperse"),
    m(ClusterImageContainer, [
      m(
        "div",
        m(ClusterImage, { src: "clustered.png", title: "Clustered stimulus" })
      ),
      m(
        "div",
        m(ClusterImage, { src: "disperse.png", title: "Disperse stimulus" })
      )
    ]),
    m(
      "h5.tc",
      "Orientation: Same / Flipped",
      " ",
      m("small.o-20", "for second presentation")
    ),
    m(ClusterImageContainer, [
      m("div", m(ClusterImage, { src: "same.png", title: "Same orientation" })),
      m(
        "div",
        m(ClusterImage, { src: "flipped.png", title: "Flipped orientation" })
      )
    ])
  ]);
});

const FowlkesMallows = fn(() => {
  return m("figure.tc.linked-content", [
    m("img", { src: "fm.png" }),
    m(
      "figcaption",
      m(
        "a",
        { href: "https://en.wikipedia.org/wiki/Fowlkes%E2%80%93Mallows_index" },
        "A measure of reliability ranging from 0 to 1."
      )
    )
  ]);
});

const DataAnalysis = fn(() => {
  return m.fragment(null, [
    m(
      "p",
      m.trust(`
<p><strong>Analysis</strong>: Linear Mixed Effects Model</p>
<p>
  <strong>Fixed Effects:</strong>
</p>
<ul>
  <li><strong>Structure</strong> (Clustered/Disperse)</li>
  <li><strong>Orientation</strong> (Same/Flipped)</li>
  <li><strong>Number of points</strong> (10 – 40)</li>
  <li><strong>Structure</strong> x <strong>Orientation</strong></li>
</ul>
<p><strong>Random Effects</strong>: Participant, Stimulus</p>
      `)
    )
  ]);
});

const Results = fn(() =>
  m("div", [
    m("img", { src: "plot.png" }),
    m.trust(`
<ul>
  <li>High clustering reliability (<em>M</em> = 0.75)</li>
  <li>
    Main effect of orientation (<em>p</em> < 0.001), with higher reliability for
    same (<em>M</em> = 0.77) vs. different orientation (<em>M</em> = 0.75) on
    second viewing.
  </li>
  <li>
    Main effect of structure (<em>p</em> < 0.001), with clustered stimuli having
    higher reliability (<em>M</em> = 0.79 vs <em>M</em> = 0.72).
  </li>
  <li>
    No structure x orientation interaction (no term in model, due to AICc
    selection).
  </li>
  <li>
    Main effect of number of points, with more points leading to slightly lower
    reliability (<em>B</em> = -0.002, <em>p</em> < 0.05)
  </li>
</ul>
`)
  ])
);

const Discussion = fn(() => {
  return m.trust(`
<ul>
  <li>
    High reliability suggests that clustering is a stable ability, and thus
    potentially a solid foundation for human TSP strategies.
  </li>
  <li>
    Linear increasing duration for increasing number of points suggests that
    clustering strategies might enable linear time complexity.
  </li>
</ul>
  `);
});

const Col1 = fn(() =>
  m("div.w-third-l.fl", [
    m(Section, { heading: "background" }, m(TSPBackground)),
    m(Section, { heading: "Research Question" }, m(ResearchQuestion)),
    m(Section, { heading: "Methods" }, m(Methods))
  ])
);

const Col2 = fn(() =>
  m("div.w-third-l.fl", [
    m(Section, { heading: "Materials" }, m(Materials)),
    m(Section, { heading: "Fowlkes-Mallows Index" }, m(FowlkesMallows)),
    m(Section, { heading: "Data Analysis" }, m(DataAnalysis))
  ])
);

const Questions = fn(() => {
  return m(
    "div.linked-content",
    m.trust(
      "Email <a href='https://vijaymarupudi.com'>Vijay Marupudi</a> at <code class='bg-black-10 ph2 br2'>vijaymarupudi[at]gatech[dot]edu</code>, live chat, or request a video call!"
    )
  );
});

const Col3 = fn(() =>
  m("div.w-third-l.fl", [
    m(Section, { heading: "Results" }, m(Results)),
    m(Section, { heading: "Discussion" }, m(Discussion)),
    m(Section, { heading: "Questions?" }, m(Questions))
  ])
);

const App = {
  view() {
    return m("div", [m(Header), m("div.cf", [m(Col1), m(Col2), m(Col3)])]);
  }
};

m.mount(document.body, App);
