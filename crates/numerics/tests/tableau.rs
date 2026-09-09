//! Consistency conditions on the coded Dormand-Prince 5(4) tableau.
//!
//! For an explicit Runge-Kutta tableau, each stage row must sum to its node
//! (sum_j a_ij = c_i, the condition that stage i evaluates f at a
//! consistent point for autonomous-equivalent problems) and each weight
//! vector must sum to one (the order-1 condition sum_i b_i = 1). These are
//! necessary, not sufficient, conditions; the order itself is measured in
//! `convergence.rs`.
//!
//! Falsifier, declared before running: any row sum differing from its node,
//! or either weight sum differing from 1, by more than 1e-15 in absolute
//! value.

use numerics::ode::dp54_tableau;

const TOL: f64 = 1e-15;

#[test]
fn stage_rows_sum_to_nodes() {
    let (c, a, _, _) = dp54_tableau();
    for (i, row) in a.iter().enumerate() {
        let sum: f64 = row.iter().sum();
        let node = c[i + 1];
        println!("row {}: sum = {:+.17e}, node = {:+.17e}", i + 2, sum, node);
        assert!(
            (sum - node).abs() <= TOL,
            "row {} sums to {} but its node is {}",
            i + 2,
            sum,
            node
        );
    }
}

#[test]
fn weights_sum_to_one() {
    let (_, _, b5, b4) = dp54_tableau();
    let s5: f64 = b5.iter().sum();
    let s4: f64 = b4.iter().sum();
    println!("sum b5 = {:+.17e}", s5);
    println!("sum b4 = {:+.17e}", s4);
    assert!((s5 - 1.0).abs() <= TOL, "b5 sums to {}", s5);
    assert!((s4 - 1.0).abs() <= TOL, "b4 sums to {}", s4);
}
