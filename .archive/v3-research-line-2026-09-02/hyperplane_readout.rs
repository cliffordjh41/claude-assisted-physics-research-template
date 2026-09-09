//! Print exactly what the lab's hyperplane scene puts in its readout.
//!
//! The scene calls these same functions across the wasm bridge. Running this
//! natively makes the displayed numbers checkable without a browser, so a
//! claim about the readout does not depend on having looked at a screen.
//!
//! Run: cargo run --release -p lab-core --example hyperplane_readout

use lab_core::*;

fn main() {
    println!("hyperplane scene readout, computed by the a2 and bounded-lattice crates\n");

    for axis in 0..4usize {
        let ang = shadow_angles(axis);
        let gaps: Vec<f64> = (0..ang.len())
            .map(|i| (ang[(i + 1) % ang.len()] - ang[i]).rem_euclid(360.0))
            .collect();
        let spread = gaps.iter().cloned().fold(f64::MIN, f64::max)
            - gaps.iter().cloned().fold(f64::MAX, f64::min);
        println!(
            "axis {}  on centroid {} of 8   angles {:?}   gap spread {:.3e} deg",
            axis,
            shadow_apex_count(axis),
            ang.iter().map(|a| a.round() as i64).collect::<Vec<_>>(),
            spread
        );
    }

    let lat = lattice_iteration_zero_angles();
    println!(
        "\nbounded-lattice iteration 0 angles  {:?}",
        lat.iter().map(|a| a.round() as i64).collect::<Vec<_>>()
    );
    println!("(the ported crate knows nothing about cubes; a2's integration test asserts the match)");

    println!("\ntetrahedron dihedral        {:.6} deg", tetra_dihedral_deg());
    println!("five-tetrahedra edge gap    {:.6} deg", tetra_edge_gap_deg());
    println!("8 tetra + 6 octa - 4pi      {:.3e} sr", vertex_closure_residual());
    println!("tetrahedra vertex coverage  {:.4} %", tetra_vertex_coverage() * 100.0);
    println!("Koch limit / tetra volume   {:.9}", koch_limit_over_tetra());

    println!("\nlift sweep on axis 0 -- distance of the two on-axis vertices from the centroid");
    for lift in [1.0, 0.75, 0.5, 0.25, 0.0] {
        let p = cube_points(0, lift);
        let levels = cube_levels();
        let mut d = Vec::new();
        for (i, l) in levels.iter().enumerate() {
            if l.abs() == 3 {
                let (x, y, z) = (p[3 * i] as f64, p[3 * i + 1] as f64, p[3 * i + 2] as f64);
                d.push((x * x + y * y + z * z).sqrt());
            }
        }
        println!("  lift {:.2}  |r| = {:.6}, {:.6}", lift, d[0], d[1]);
    }

    for r in 0..=3i32 {
        let cells = hyperplane_points(r).len() / 3;
        let links = hyperplane_edges(r).len() / 2;
        println!(
            "\nhyperplane radius {}  cells {} (3r^2+3r+1 = {})  neighbour links {}",
            r,
            cells,
            3 * r * r + 3 * r + 1,
            links
        );
    }
}
