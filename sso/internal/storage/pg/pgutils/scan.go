package pgutils

import "github.com/jmoiron/sqlx"

func StructSliceScan[T any](rows *sqlx.Rows, dest *[]*T) error {
	defer rows.Close()

	for rows.Next() {
		var row T
		if err := rows.StructScan(&row); err != nil {
			return err
		}

		*dest = append(*dest, &row)
	}

	return nil
}
