"""Removed: substitutes

Revision ID: edf507bcd521
Revises: cdad1c1a7a79
Create Date: 2022-11-10 17:01:20.724790

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'edf507bcd521'
down_revision = 'cdad1c1a7a79'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'category', ['id'])
    op.drop_constraint('match_monitoring_substitute_id_fkey', 'match_monitoring', type_='foreignkey')
    op.drop_column('match_monitoring', 'substitute_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('match_monitoring', sa.Column('substitute_id', postgresql.UUID(), autoincrement=False, nullable=True))
    op.create_foreign_key('match_monitoring_substitute_id_fkey', 'match_monitoring', 'goalkeeper', ['substitute_id'], ['id'])
    op.drop_constraint(None, 'category', type_='unique')
    # ### end Alembic commands ###
